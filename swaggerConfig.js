const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Social Media App API",
            version: "1.0.0",
            description: "API documentation for the Social Media App : Mitesh Singla",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local server",
            },
        ],
    },
    apis: ["./routes/auth.routes.js"], // Path to your API route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
