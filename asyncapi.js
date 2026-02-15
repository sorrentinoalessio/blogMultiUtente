import { serve, setup } from "@asyncapi/react-component";

const asyncapiSpec = {
  asyncapi: "2.6.0",
  info: {
    title: "Socket API Social",
    version: "1.0.0",
    description: "Documentazione WebSocket per commenti e like sui post",
  },
  servers: {
    production: {
      url: "ws://localhost:3000",
      protocol: "socket.io",
      description: "Server Socket.IO",
    },
  },
  channels: {
    COMMENT_POST: {
      description: "Evento per aggiungere un commento ad un post",
      subscribe: {
        summary: "Client invia un commento",
        message: {
          name: "CommentPostRequest",
          payload: {
            type: "object",
            required: ["postId", "content"],
            properties: {
              postId: { type: "string", example: "uuid-post-id" },
              content: { type: "string", example: "Questo è un commento" },
            },
          },
        },
      },
      publish: {
        summary: "Server risponde con ACK",
        message: {
          name: "CommentPostResponse",
          payload: {
            type: "object",
            properties: {
              result: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: {
                    type: "object",
                    nullable: true,
                    properties: {
                      id: { type: "string" },
                      postId: { type: "string" },
                      userId: { type: "string" },
                      content: { type: "string" },
                      createdAt: { type: "string", format: "date-time" },
                    },
                  },
                  error: { type: "string", nullable: true },
                },
              },
            },
          },
        },
      },
    },

    LIKE_POST: {
      description: "Evento per mettere o rimuovere like ad un post",
      subscribe: {
        summary: "Client invia richiesta like",
        message: {
          name: "LikePostRequest",
          payload: {
            type: "object",
            required: ["postId"],
            properties: {
              postId: { type: "string", example: "uuid-post-id" },
            },
          },
        },
      },
      publish: {
        summary: "Server risponde con ACK",
        message: {
          name: "LikePostResponse",
          payload: {
            type: "object",
            properties: {
              result: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  postId: { type: "string", nullable: true, description: "ID del post aggiornato" },
                  error: { type: "string", nullable: true },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token JWT per handshake",
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

export { asyncapiSpec };
