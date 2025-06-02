import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "../api/middlewares/errorHandler";
import { requestLogger } from "../api/middlewares/requestLogger";
import { UserController } from "../application/controllers/UserController";
import { SystemController } from "../application/controllers/SystemController";
import { UserService } from "../application/services/UserService";
import { SystemService } from '../application/services/SystemService';

import { DynamoUserRepository } from "../infrastructure/repositories/implementation/DynamoUserRepository";
import { SystemRepository } from "../infrastructure/repositories/implementation/SystemRepository";

import { createUserRoutes } from "./handlers/userRoutes";
import { createSystemRoutes } from "./handlers/systemRoutes";

import { DatabaseConfig } from "../infrastructure/config/postgresql";


export class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.setupDependencies();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private userController!: UserController;
  private systemController!: SystemController;

  private setupDependencies(): void {
    const prisma = DatabaseConfig.getClient();

    const userRepository = new DynamoUserRepository();
    const systemRepository = new SystemRepository(prisma);

    const userService = new UserService(userRepository);
    const systemService = new SystemService(systemRepository);


    this.userController = new UserController(userService);
    this.systemController = new SystemController(systemService); 
  }

  private setupMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(requestLogger);
  }

  private setupRoutes(): void {
    // Rutas limpias, sin proxy
    this.app.use(
      "/maintenanceMastersRDS/users",
      createUserRoutes(this.userController)
    );
    this.app.use(
      "/maintenanceMastersRDS/system",
      createSystemRoutes(this.systemController)
    );

    // Ruta no encontrada (último recurso)
    this.app.use("*", (req, res) => {
      res.status(404).json({
        success: false,
        error: {
          message: "Endpoint not found",
          path: req.originalUrl,
          method: req.method,
        },
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public getApp(): express.Application {
    return this.app;
  }
}
