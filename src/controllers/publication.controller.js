const Publication = require("../models/publication.model");
const Comment = require("../models/comment.model");
const cloudinary = require("../config/cloudinary.config");
const { deleteImageFromCloudinary } = require("../utils/cloudinary.utils");
const { log } = require("console");
const fs = require("fs").promises;

exports.createPublication = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Aucune image fournie" });
        }

        await fs.access(req.file.path);

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "publications",
            use_filename: true,
            unique_filename: false
        });

        if (!result.secure_url) {
            throw new Error("Échec de l'upload sur Cloudinary");
        }

        await fs.unlink(req.file.path);

        const publicationData = {
            user_id: req.user.id,
            image_url: result.secure_url,
            contenu: req.body.contenu,
            titre: req.body.titre,
        };
        const newPublication = await Publication.create(publicationData);
        newPublication.comment_count = 0; // Nouvelle publication, aucun commentaire

        res.status(201).json(newPublication);
    } catch (error) {
        console.error("Erreur lors de la création de la publication:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.getAllPublications = async (req, res) => {
    try {
        const publications = await Publication.getAll();
        const formattedPublications = publications.map(pub => ({
            ...pub,
            comment_count: pub.comments.length,
            comments: pub.comments
        }));
        res.status(200).json({ publications: formattedPublications });
    } catch (error) {
        console.error("Erreur lors de la récupération des publications:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.getPublicationById = async (req, res) => {
    try {
        const publication = await Publication.getById(parseInt(req.params.id));
        if (!publication) {
            return res.status(404).json({ error: "Publication non trouvée" });
        }
        const formattedPublication = {
            ...publication,
            comment_count: publication.comments.length,
            comments: publication.comments
        };
        res.status(200).json(formattedPublication);
    } catch (error) {
        console.error("Erreur lors de la récupération de la publication:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.updatePublication = async (req, res) => {
    try {
        const publication = await Publication.getById(parseInt(req.params.id));
        if (!publication) {
            return res.status(404).json({ error: "Publication non trouvée" });
        }
        if (publication.user_id !== req.user.id) {
            return res.status(403).json({ error: "Non autorisé à modifier cette publication" });
        }

        let updateData = { ...req.body };

        if (req.file) {
            await fs.access(req.file.path);

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "publications",
                use_filename: true,
                unique_filename: false
            });

            if (!result.secure_url) {
                throw new Error("Échec de l'upload sur Cloudinary");
            }

            if (publication.image_url) {
                await deleteImageFromCloudinary(publication.image_url);
            }

            updateData.image_url = result.secure_url;
            await fs.unlink(req.file.path);
        }

        const updatedPublication = await Publication.update(parseInt(req.params.id), updateData);
        const comments = await Comment.getByPublicationId(updatedPublication.id);
        updatedPublication.comment_count = comments.length;

        res.status(200).json(updatedPublication);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la publication:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.deletePublication = async (req, res) => {
    try {
        const publication = await Publication.getById(parseInt(req.params.id));
        if (!publication) {
            return res.status(404).json({ error: "Publication non trouvée" });
        }
        if (publication.user_id !== req.user.id) {
            return res.status(403).json({ error: "Non autorisé à supprimer cette publication" });
        }

        if (publication.image_url) {
            await deleteImageFromCloudinary(publication.image_url);
        }

        await Publication.delete(parseInt(req.params.id));
        res.status(204).send();
    } catch (error) {
        console.error("Erreur lors de la suppression de la publication:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.likePublication = async (req, res) => {
    try {
        const publication = await Publication.getById(parseInt(req.params.id));
        if (!publication) {
            return res.status(404).json({ error: "Publication non trouvée" });
        }

        const updatedPublication = await Publication.update(parseInt(req.params.id), {
            reactions: publication.reactions + 1
        });
        const comments = await Comment.getByPublicationId(updatedPublication.id);
        updatedPublication.comment_count = comments.length;

        res.status(200).json(updatedPublication);
    } catch (error) {
        console.error("Erreur lors de la réaction à la publication:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.dislikePublication = async (req, res) => {
    try {
        const publication = await Publication.getById(parseInt(req.params.id));
        if (!publication) {
            return res.status(404).json({ error: "Publication non trouvée" });
        }

        const updatedPublication = await Publication.update(parseInt(req.params.id), {
            reactions: publication.reactions - 1 > 0 ? publication.reactions - 1 : 0
        });
        const comments = await Comment.getByPublicationId(updatedPublication.id);
        updatedPublication.comment_count = comments.length;

        res.status(200).json(updatedPublication);
    } catch (error) {
        console.error("Erreur lors de la réaction à la publication:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};