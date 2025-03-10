const express = require("express");
const router = express.Router();
const { 
    createComment, 
    getCommentsByPublication, 
    createReply, 
    deleteComment,
    getMessagesByComment,
    likeMessage,
    dislikeMessage
} = require("../controllers/comment.controller");
const { IsAuthenticated } = require("../middlewares/auth.middleware");
const validateHandler = require("../middlewares/error.handler");
const { createCommentValidationRules } = require("../validators/comment.validator"); // Assurez-vous que ce fichier existe

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Gestion des commentaires
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID du commentaire
 *         publication_id:
 *           type: integer
 *           description: ID de la publication associée
 *         first_message_id:
 *           type: integer
 *           description: ID du premier message
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de mise à jour
 *         first_message:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             content:
 *               type: string
 *             reactions:
 *               type: integer
 *             created_at:
 *               type: string
 *               format: date-time
 *             updated_at:
 *               type: string
 *               format: date-time
 *             comment_id:
 *               type: integer
 *               nullable: true
 *         replies:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               content:
 *                 type: string
 *               reactions:
 *                 type: integer
 *               created_at:
 *                 type: string
 *                 format: date-time
 *               updated_at:
 *                 type: string
 *                 format: date-time
 *               comment_id:
 *                 type: integer
 *           description: Liste des réponses au commentaire
 */

/**
 * @swagger
 * /api/publications/{id}/comments:
 *   post:
 *     summary: Créer un nouveau commentaire pour une publication
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
 *                 description: Contenu du commentaire
 *                 example: "Ceci est un commentaire"
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
 *         description: Liste des commentaires avec leurs premiers messages et réponses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
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
 *     summary: Ajouter une réponse à un commentaire
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
 *                 example: "Ceci est une réponse"
 *     responses:
 *       201:
 *         description: Réponse ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
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
 *     summary: Supprimer un commentaire
 *     tags: [Comments]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
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
router.delete("/comments/:commentId", deleteComment);

/**
 * @swagger
 * /api/comments/{commentId}/messages:
 *   get:
 *     summary: Récupérer tous les messages d'un commentaire
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       404:
 *         description: Commentaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/comments/:commentId/messages", getMessagesByComment);

/**
 * @swagger
 * /api/messages/{messageId}/react/like:
 *   post:
 *     summary: Réagir à un message
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Réaction enregistrée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Message non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/messages/:messageId/react/like", likeMessage);

/**
 * @swagger
 * /api/messages/{messageId}/react/dislike:
 *   post:
 *     summary: Réagir à un message
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Réaction enregistrée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Message non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/messages/:messageId/react/dislike", dislikeMessage);

module.exports = router;