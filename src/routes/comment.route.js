const express = require("express");
const router = express.Router();
const { 
    createComment, 
    getCommentsByPublication, 
    createReply, 
    deleteComment 
} = require("../controllers/comment.controller");
const { createCommentValidationRules } = require("../validators/comment.validator");
const validateHandler = require("../middlewares/error.handler");
const { IsAuthenticated } = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Gestion des commentaires et discussions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - publication_id
 *         - first_message_id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique du commentaire
 *         publication_id:
 *           type: integer
 *           description: ID de la publication associée
 *         first_message_id:
 *           type: integer
 *           description: ID du premier message de la discussion
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de mise à jour
 *         first_message:
 *           $ref: '#/components/schemas/Message'
 *         replies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 *       example:
 *         id: 1
 *         publication_id: 1
 *         first_message_id: 1
 *         created_at: "2023-10-01T10:00:00Z"
 *         updated_at: "2023-10-01T10:00:00Z"
 *         first_message:
 *           id: 1
 *           content: "Ceci est le premier message."
 *           reactions: 0
 *           created_at: "2023-10-01T10:00:00Z"
 *           updated_at: "2023-10-01T10:00:00Z"
 *         replies:
 *           - id: 2
 *             content: "Ceci est une réponse."
 *             reactions: 0
 *             created_at: "2023-10-01T10:05:00Z"
 *             updated_at: "2023-10-01T10:05:00Z"
 *     Message:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique du message
 *         content:
 *           type: string
 *           description: Contenu du message
 *         reactions:
 *           type: integer
 *           description: Nombre de réactions
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
 *         content: "Ceci est un message."
 *         reactions: 0
 *         created_at: "2023-10-01T10:00:00Z"
 *         updated_at: "2023-10-01T10:00:00Z"
 */

/**
 * @swagger
 * /api/publications/{id}/comments:
 *   post:
 *     summary: Créer un nouveau commentaire (discussion)
 *     tags: [Comments]
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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Contenu du premier message
 *                 example: "Ceci est un commentaire."
 *     responses:
 *       201:
 *         description: Commentaire créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *                 firstMessage:
 *                   $ref: '#/components/schemas/Message'
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
router.post("/publications/:id/comments", createCommentValidationRules, validateHandler, createComment);

/**
 * @swagger
 * /api/publications/{id}/comments:
 *   get:
 *     summary: Récupérer tous les commentaires d'une publication
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la publication
 *     responses:
 *       200:
 *         description: Liste des commentaires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
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
router.get("/publications/:id/comments", getCommentsByPublication);

/**
 * @swagger
 * /api/comments/{commentId}/replies:
 *   post:
 *     summary: Ajouter une réponse à un commentaire (discussion)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du commentaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Contenu de la réponse
 *                 example: "Ceci est une réponse."
 *     responses:
 *       201:
 *         description: Réponse ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Commentaire non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Commentaire non trouvé"
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
router.post("/comments/:commentId/replies", createCommentValidationRules, validateHandler, createReply);

/**
 * @swagger
 * /api/comments/{commentId}:
 *   delete:
 *     summary: Supprimer un commentaire (discussion)
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du commentaire
 *     responses:
 *       204:
 *         description: Commentaire supprimé avec succès
 *       404:
 *         description: Commentaire non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Commentaire non trouvé"
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
router.delete("/comments/:commentId", IsAuthenticated, deleteComment);

module.exports = router;