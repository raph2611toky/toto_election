const express = require("express");
const router = express.Router();
const { 
    registerAdmin, 
    loginAdmin, 
    getAdminProfile, 
    updateAdminProfile,
    logout,
    getAllUsers
} = require("../controllers/user.controller");
const { createUserValidationRules, updateUserValidationRules } = require("../validators/user.validator");
const validateHandler = require("../middlewares/error.handler");
const { IsAuthenticated } = require("../middlewares/auth.middleware");
const upload = require("../config/multer.config");

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Gestion des administrateurs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique de l'administrateur
 *         name:
 *           type: string
 *           description: Nom complet de l'administrateur
 *         email:
 *           type: string
 *           description: Adresse email
 *         password:
 *           type: string
 *           description: Mot de passe
 *         phone:
 *           type: string
 *           description: Numéro de téléphone
 *         profile:
 *           type: string
 *           description: URL de l'image de profil
 *         is_active:
 *           type: boolean
 *           description: Statut d'activité de l'administrateur
 *         role:
 *           type: string
 *           enum: [ADMIN, MODERATEUR, VISITEUR]
 *           description: Rôle de l'utilisateur
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
 *         name: Admin User
 *         email: admin@example.com
 *         password: Admin@123
 *         phone: "+261341234567"
 *         profile: "https://res.cloudinary.com/example/image/upload/v1234567890/admin_profiles/profile.jpg"
 *         is_active: true
 *         role: "ADMIN"
 *         created_at: "2023-10-01T10:00:00Z"
 *         updated_at: "2023-10-01T10:00:00Z"
 */

/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: Récupérer tous les administrateurs
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des administrateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
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
router.get("/", IsAuthenticated, getAllUsers);

/**
 * @swagger
 * /api/admins/me:
 *   get:
 *     summary: Récupérer le profil de l'administrateur connecté
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profil de l'administrateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       404:
 *         description: Profil non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Profil non trouvé"
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
router.get("/me", IsAuthenticated, getAdminProfile);

/**
 * @swagger
 * /api/admins/register:
 *   post:
 *     summary: Enregistrer un administrateur
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom complet de l'administrateur
 *                 example: "Admin User"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 description: Mot de passe
 *                 example: "Admin@123"
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone
 *                 example: "+261341234567"
 *               profile:
 *                 type: string
 *                 format: binary
 *                 description: Image de profil (optionnel, une image par défaut sera utilisée si non fournie)
 *     responses:
 *       201:
 *         description: Administrateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: "admin@example.com"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOi..."
 *       401:
 *         description: L'administrateur existe déjà
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cet administrateur s'est déjà enregistré"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MODERATEUR, VISITEUR]
 *                 description: Rôle de l'utilisateur (optionnel, par défaut ADMIN)
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
router.post("/register", upload.single("profile"), createUserValidationRules, validateHandler, registerAdmin);

/**
 * @swagger
 * /api/admins/login:
 *   post:
 *     summary: Connexion de l'administrateur
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "Admin@123"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Admin User"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOi..."
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Identifiants invalides"
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
router.post("/login", loginAdmin);

/**
 * @swagger
 * /api/admins/me:
 *   put:
 *     summary: Mettre à jour le profil de l'administrateur connecté
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nouveau nom
 *                 example: "Updated Admin User"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nouvel email
 *                 example: "updated.admin@example.com"
 *               password:
 *                 type: string
 *                 description: Nouveau mot de passe
 *                 example: "NewAdmin@123"
 *               phone:
 *                 type: string
 *                 description: Nouveau numéro de téléphone
 *                 example: "+261341234567"
 *               profile:
 *                 type: string
 *                 format: binary
 *                 description: Nouvelle image de profil (optionnel, l'image par défaut sera utilisée si aucune image n'existe encore)
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MODERATEUR, VISITEUR]
 *                 description: Rôle de l'utilisateur (optionnel, par défaut ADMIN)
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Données invalides"
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
router.put("/me", IsAuthenticated, upload.single("profile"), updateUserValidationRules, validateHandler, updateAdminProfile);

/**
 * @swagger
 * /api/admins/logout:
 *   put:
 *     summary: Déconnexion de l'administrateur
 *     tags: [Admins]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Déconnexion réussie"
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
router.put("/logout", IsAuthenticated, logout);

module.exports = router;