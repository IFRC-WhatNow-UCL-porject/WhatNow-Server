// /config/swaggerDef.js
const { port } = require('./config');

module.exports = {
    openapi: '3.0.0',
    info: {
      title: 'OpenAPI documentation',
      version: '1.0.0',
      description: 'API description',
    },
    servers: [
      {
        url: 'http://localhost:' + port,
        description: 'Local server',
      },
    ],
    tags: [
      {
        name: 'ApiUsage',
        description: "Api usage operations => /apps",
      },
      {
        name: 'ApiUser',
        description: "API user operations => /apiUsers",
      },
      {
        name: 'App',
        description: "App management and retrieval => /app",
      },
      {
        name: 'AuditLog',
        description: "Operations related to audit logs => /auditLog",
      },
      {
        name: 'Auth',
        description: "Authentication management => /auth",
      },
      {
        name: 'BulkUpload',
        description: "Bulk upload operations => /bulkUpload",
      },
      {
        name: 'ContentMessage',
        description: "Content's message management => /contentMessage",
      },
      {
        name: 'Content',
        description: "Content management => /content",
      },
      {
        name: 'Language',
        description: "Language management => /language",
      },
      {
        name: 'Message' ,
        description: "Message management => /messages",
      },
      {
        name: 'Profile',
        description: "User profile management => /profile",
      },
      {
        name: 'Publish',
        description: "publish operations => /publish",
      },
      {
        name: 'Region',
        description: "Operations related to regions => /region",
      },
      {
        name: 'Society',
        description: "Society management => /society",
      },
      {
        name: 'SuperAdmin',
        description: "Available routes for super admin => /super",
      },
      {
        name: 'Term',
        description: "Term management => /term",
      },
      {
        name: 'User',
        description: 'User operations => /users',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  };
  