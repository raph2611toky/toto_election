const { body } = require("express-validator");

const createCommentValidationRules = [
    body("content")
        .notEmpty()
        .withMessage("Le contenu du commentaire est requis")
        .isLength({ min: 1 })
        .withMessage("Le commentaire doit contenir au moins 1 caractère"),
];

module.exports = { createCommentValidationRules };