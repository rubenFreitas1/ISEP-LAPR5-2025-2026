import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import config from "../../config";
import path from "path";

export default function swaggerLoader(app: Application) {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "OEM API",
        version: "1.0.0",
        description: "API documentation for the OEM project"
      },
      servers: [
        {
          url: `http://localhost:${config.port}/api`,
        },
      ],
    },
    apis: [
      path.join(__dirname, "../api/routes/*.ts"),
      path.join(__dirname, "../controllers/*.ts"),
      path.join(__dirname, "../dto/*.ts"),
      path.join(__dirname, "../api/swagger/*.ts")
    ],
  };

  const swaggerSpec = swaggerJSDoc(options);

  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
