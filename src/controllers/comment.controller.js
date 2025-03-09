const Comment = require("../models/comment.model");
const Message = require("../models/message.model");
const Publication = require("../models/publication.model");

exports.createComment = async (req, res) => {
    try {
        const publication = await Publication.getById(parseInt(req.params.id));
        if (!publication) {
            return res.status(404).json({ error: "Publication non trouvée" });
        }

        const firstMessageData = {
            content: req.body.content,
        };
        const firstMessage = await Message.create(firstMessageData);

        const commentData = {
            publication_id: parseInt(req.params.id),
            first_message_id: firstMessage.id,
        };
        const newComment = await Comment.create(commentData);

        res.status(201).json({ comment: newComment, firstMessage });
    } catch (error) {
        console.error("Erreur lors de la création du commentaire:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.getCommentsByPublication = async (req, res) => {
    try {
        const publication = await Publication.getById(parseInt(req.params.id));
        if (!publication) {
            return res.status(404).json({ error: "Publication non trouvée" });
        }

        const comments = await Comment.getByPublicationId(parseInt(req.params.id));
        res.status(200).json(comments);
    } catch (error) {
        console.error("Erreur lors de la récupération des commentaires:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.createReply = async (req, res) => {
    try {
        const comment = await Comment.getById(parseInt(req.params.commentId));
        if (!comment) {
            return res.status(404).json({ error: "Commentaire non trouvé" });
        }

        const replyData = {
            content: req.body.content,
        };
        const newReply = await Message.create(replyData);

        await prisma.comment.update({
            where: { id: parseInt(req.params.commentId) },
            data: {
                replies: {
                    connect: { id: newReply.id },
                },
            },
        });

        res.status(201).json(newReply);
    } catch (error) {
        console.error("Erreur lors de la création de la réponse:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.getById(parseInt(req.params.commentId));
        if (!comment) {
            return res.status(404).json({ error: "Commentaire non trouvé" });
        }

        await Message.delete(comment.first_message_id);
        for (const reply of comment.replies) {
            await Message.delete(reply.id);
        }

        await Comment.delete(parseInt(req.params.commentId));
        res.status(204).send();
    } catch (error) {
        console.error("Erreur lors de la suppression du commentaire:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};