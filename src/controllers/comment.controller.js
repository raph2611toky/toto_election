const Comment = require("../models/comment.model");
const Message = require("../models/message.model");
const Publication = require("../models/publication.model");
const { prisma } = require("../models/comment.model");

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

        const responseComment = {
            ...newComment,
            first_message: firstMessage,
            replies: []
        };

        res.status(201).json({ comment: responseComment });
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
        const formattedComments = await Promise.all(
            comments.map(async (comment) => {
                const firstMessage = await Message.getById(comment.first_message_id);
                return {
                    ...comment,
                    first_message: firstMessage,
                    replies: comment.replies || []
                };
            })
        );

        res.status(200).json({ comments: formattedComments });
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
            comment_id: comment.id
        };
        const newReply = await Message.create(replyData);

        const updatedComment = await Comment.getById(parseInt(req.params.commentId));

        const responseComment = {
            ...updatedComment,
            first_message: updatedComment.first_message,
            replies: updatedComment.replies || []
        };

        res.status(201).json({ comment: responseComment });
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

        res.status(204).json({});
    } catch (error) {
        console.error("Erreur lors de la suppression du commentaire:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.getMessagesByComment = async (req, res) => {
    try {
        const comment = await Comment.getById(parseInt(req.params.commentId));
        if (!comment) {
            return res.status(404).json({ error: "Commentaire non trouvé" });
        }

        const messages = [comment.first_message, ...comment.replies];

        res.status(200).json(messages);
    } catch (error) {
        console.error("Erreur lors de la récupération des messages:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.likeMessage = async (req, res) => {
    try {
        const messageId = parseInt(req.params.messageId);
        const message = await Message.getById(messageId);
        if (!message) {
            return res.status(404).json({ error: "Message non trouvé" });
        }

        const updatedMessage = await Message.updateLike(messageId);
        res.status(200).json(updatedMessage);
    } catch (error) {
        console.error("Erreur lors de la réaction au message:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.dislikeMessage = async (req, res) => {
    try {
        const messageId = parseInt(req.params.messageId);
        const message = await Message.getById(messageId);
        if (!message) {
            return res.status(404).json({ error: "Message non trouvé" });
        }

        const updatedMessage = await Message.updateDislike(messageId);
        res.status(200).json(updatedMessage);
    } catch (error) {
        console.error("Erreur lors de la réaction au message:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};