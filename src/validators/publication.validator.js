const { body } = require("express-validator");

const createPublicationValidationRules = [
    body("image_url")
        .notEmpty()
        .withMessage("L'URL de l'image est requise")
        .isURL()
        .withMessage("L'URL de l'image n'est pas valide"),
    body("contenu")
        .notEmpty()
        .withMessage("Le contenu est requis")
        .isLength({ min: 10 })
        .withMessage("Le contenu doit contenir au moins 10 caractères"),
];

const updatePublicationValidationRules = [
    body("image_url")
        .optional()
        .isURL()
        .withMessage("L'URL de l'image n'est pas valide"),
    body("contenu")
        .optional()
        .isLength({ min: 10 })
        .withMessage("Le contenu doit contenir au moins 10 caractères"),
];

module.exports = { createPublicationValidationRules, updatePublicationValidationRules };