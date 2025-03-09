const Publication = require("../models/publication.model");
const cloudinary = require("../config/cloudinary.config");
const fs = require("fs").promises;

exports.createPublication = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Aucune image fournie" });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "publications",
            use_filename: true,
            unique_filename: false
        });

        await fs.unlink(req.file.path);

        const publicationData = {
            user_id: req.user.id,
            image_url: result.secure_url,
            contenu: req.body.contenu,
        };
        const newPublication = await Publication.create(publicationData);
        res.status(201).json(newPublication);
    } catch (error) {
        console.error("Erreur lors de la création de la publication:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.getAllPublications = async (req, res) => {
    try {
        const publications = await Publication.getAll();
        res.status(200).json(publications);
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
        res.status(200).json(publication);
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

        const updatedPublication = await Publication.update(parseInt(req.params.id), req.body);
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

        await Publication.delete(parseInt(req.params.id));
        res.status(204).send();
    } catch (error) {
        console.error("Erreur lors de la suppression de la publication:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};