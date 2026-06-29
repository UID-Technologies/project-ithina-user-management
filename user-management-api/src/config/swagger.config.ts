import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env.config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ithina User Management API',
      version: '1.0.0',
      description: 'Enterprise RBAC API for the Superadmin Console',
    },
    servers: [{ url: env.API_PUBLIC_URL, description: 'API' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {},
            meta: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
              },
            },
            errors: { type: 'array', items: {} },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/docs/openapi.yaml', './src/modules/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
