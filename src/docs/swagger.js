const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Pour le site web d'election de Toto à l'AEENI",
      version: "1.0.0",
      description: 'API REST pour le site Toto Election',
    },
    servers: [
      {
        url: 'https://phenix-nu.vercel.app',
      },
      {
        url: 'https://toto-election-1.onrender.com',
      },
    ],
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  apis: ["./src/routes/*.js"], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
