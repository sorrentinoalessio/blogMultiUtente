import swaggerJsDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

// Configurazione Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Example",
      version: "1.0.0",
      description: "Documentazione API di esempio",
    },
    servers: [
      {
        url: process.env.SWAGGER_URL || "http://localhost:3001" ,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Inserisci il token come: Bearer <tuo-token>"
        }
      }
    },
    security: [
      { bearerAuth: [] } // Applica il Bearer token globalmente, puoi rimuoverlo e applicarlo solo sulle rotte che lo richiedono
    ]
  },
  apis: ["./src/routes/*.js"], // Dove cercare i commenti per generare la documentazione
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerUiExpress as swaggerUi, swaggerDocs };

