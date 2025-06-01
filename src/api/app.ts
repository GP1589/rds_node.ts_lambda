import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "../api/middlewares/errorHandler";
import { requestLogger } from "../api/middlewares/requestLogger";
import { UserController } from "../application/controllers/UserController";
import { UserService } from "../application/services/UserService";
import { DynamoUserRepository } from "../infrastructure/repositories/implementation/DynamoUserRepository";
import { createUserRoutes } from "../api/routes/userRoutes"; // 👈 importar tus rutas

export class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.setupDependencies();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private userController!: UserController; // 👈 mantener como propiedad para inyectar

  private setupDependencies(): void {
    const userRepository = new DynamoUserRepository();
    const userService = new UserService(userRepository);
    this.userController = new UserController(userService);
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
    this.app.use("/users", createUserRoutes(this.userController));

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