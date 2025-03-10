const express = require("express");
const router = express.Router();
const { 
    createPublication, 
    getAllPublications, 
    getPublicationById, 
    updatePublication, 
    deletePublication,
    likePublication,
    dislikePublication
} = require("../controllers/publication.controller");
const { createPublicationValidationRules, updatePublicationValidationRules } = require("../validators/publication.validator");
const validateHandler = require("../middlewares/error.handler");
const { IsAuthenticated } = require("../middlewares/auth.middleware");
const upload = require("../config/multer.config"); // Middleware Multer

/**
 * @swagger
 * tags:
 *   name: Publications
 *   description: Gestion des publications
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Publication:
 *       type: object
 *       required:
 *         - user_id
 *         - image_url
 *         - contenu
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique de la publication
 *         user_id:
 *           type: integer
 *           description: ID de l'administrateur qui a créé la publication
 *         image_url:
 *           type: string
 *           description: URL de l'image de la publication
 *         contenu:
 *           type: string
 *           description: Contenu de la publication
 *         reactions:
 *           type: integer
 *           description: Nombre de réactions
 *         comment_count:
 *           type: integer
 *           description: Nombre de commentaires
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de mise à jour
 *       example:
 *         id: 1
 *         user_id: 1
 *         image_url: "https://res.cloudinary.com/example/image/upload/v1234567890/publications/publication.jpg"
 *         contenu: "Ceci est une publication de test."
 *         reactions: 0
 *         created_at: "2023-10-01T10:00:00Z"
 *         updated_at: "2023-10-01T10:00:00Z"
 */

/**
 * @swagger
 * /api/publications:
 *   post:
 *     summary: Créer une nouvelle publication
 *     tags: [Publications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - contenu
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Fichier image de la publication
 *               contenu:
 *                 type: string
 *                 description: Contenu de la publication
 *                 example: "Ceci est une publication de test."
 *     responses:
 *       201:
 *         description: Publication créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Publication'
 *       400:
 *         description: Aucune image fournie ou données invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Aucune image fournie"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur interne du serveur"
 */
router.post("/", IsAuthenticated, upload.single("image"), createPublicationValidationRules, validateHandler, createPublication);

/**
 * @swagger
 * /api/publications:
 *   get:
 *     summary: Récupérer toutes les publications
 *     tags: [Publications]
 *     responses:
 *       200:
 *         description: Liste des publications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Publication'
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur interne du serveur"
 */
router.get("/", getAllPublications);

/**
 * @swagger
 * /api/publications/{id}:
 *   get:
 *     summary: Récupérer une publication par ID
 *     tags: [Publications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la publication
 *     responses:
 *       200:
 *         description: Détails de la publication
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Publication'
 *       404:
 *         description: Publication non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Publication non trouvée"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur interne du serveur"
 */
router.get("/:id", getPublicationById);

/**
 * @swagger
 * /api/publications/{id}:
 *   put:
 *     summary: Mettre à jour une publication
 *     tags: [Publications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la publication
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Nouvelle image de la publication (optionnel)
 *               contenu:
 *                 type: string
 *                 description: Nouveau contenu (optionnel)
 *                 example: "Ceci est une publication mise à jour."
 *     responses:
 *       200:
 *         description: Publication mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Publication'
 *       403:
 *         description: Non autorisé à modifier cette publication
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Non autorisé à modifier cette publication"
 *       404:
 *         description: Publication non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Publication non trouvée"
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors du transfert de l'image"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur interne du serveur"
 */
router.put("/:id", IsAuthenticated, upload.single("image"), updatePublicationValidationRules, validateHandler, updatePublication);

/**
 * @swagger
 * /api/publications/{id}/delete:
 *   delete:
 *     summary: Supprimer une publication
 *     tags: [Publications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la publication
 *     responses:
 *       204:
 *         description: Publication supprimée avec succès
 *       403:
 *         description: Non autorisé à supprimer cette publication
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Non autorisé à supprimer cette publication"
 *       404:
 *         description: Publication non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Publication non trouvée"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur interne du serveur"
 */
router.delete("/:id/delete", IsAuthenticated, deletePublication);

/**
 * @swagger
 * /api/publications/{id}/react/like:
 *   put:
 *     summary: Réagir à une publication
 *     tags: [Publications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Réaction enregistrée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Publication'
 *       404:
 *         description: Publication non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id/react/like", likePublication);

/**
 * @swagger
 * /api/publications/{id}/react/dislike:
 *   put:
 *     summary: Réagir à une publication
 *     tags: [Publications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Réaction enregistrée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Publication'
 *       404:
 *         description: Publication non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id/react/dislike", dislikePublication);

module.exports = router;