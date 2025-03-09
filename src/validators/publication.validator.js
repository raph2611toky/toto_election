const { body } = require("express-validator");

const createPublicationValidationRules = [
    body("contenu")
        .notEmpty()
        .withMessage("Le contenu est requis")
        .isLength({ min: 10 })
        .withMessage("Le contenu doit contenir au moins 10 caractères"),
];

const updatePublicationValidationRules = [
    body("contenu")
        .optional()
        .isLength({ min: 10 })
        .withMessage("Le contenu doit contenir au moins 10 caractères"),
];

module.exports = { createPublicationValidationRules, updatePublicationValidationRules };