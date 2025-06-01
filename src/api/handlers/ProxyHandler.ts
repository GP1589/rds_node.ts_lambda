import { Request, Response, NextFunction } from 'express';
import { UserController } from '../../application/controllers/UserController';

export class ProxyHandler {
  constructor(private userController: UserController) {}

  handleRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { method } = req;
      // Usar req.originalUrl o req.url en lugar de req.path para obtener la URL completa
      const fullPath = req.originalUrl || req.url || req.path;
      const pathSegments = fullPath.split('/').filter(segment => segment !== '');

      // Log de la petición entrante
      console.log(`Proxy handling: ${method} ${fullPath}`);
      console.log(`Path segments:`, pathSegments);

      // Routing basado en el path y método
      if (pathSegments[0] === 'users') {
        await this.handleUserRoutes(req, res, next);
      } else if (fullPath === '/health') {
        res.json({
          success: true,
          message: 'API is healthy',
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(404).json({
          success: false,
          error: {
            message: 'Endpoint not found',
            path: fullPath,
            method: method
          }
        });
      }
    } catch (error) {
      next(error);
    }
  };

  private handleUserRoutes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { method } = req;
    const fullPath = req.originalUrl || req.url || req.path;
    const pathSegments = fullPath.split('/').filter(segment => segment !== '');

    console.log(`Handling user route: ${method} ${fullPath}, segments:`, pathSegments);

    try {
      switch (method) {
        case 'POST':
          // POST /users - Crear usuario
          if (pathSegments.length === 1) {
            await this.userController.createUser(req, res, next);
          } else {
            this.sendNotFound(res, fullPath, method);
          }
          break;

        case 'GET':
          if (pathSegments.length === 1) {
            // GET /users - Obtener todos los usuarios
            await this.userController.getAllUsers(req, res, next);
          } else if (pathSegments.length === 2) {
            // GET /users/:userId - Obtener usuario por ID
            await this.userController.getUserById(req, res, next);
          } else {
            this.sendNotFound(res, fullPath, method);
          }
          break;

        case 'PUT':
          // PUT /users/:userId - Actualizar usuario
          if (pathSegments.length === 2) {
            await this.userController.updateUser(req, res, next);
          } else {
            this.sendNotFound(res, fullPath, method);
          }
          break;

        case 'DELETE':
          // DELETE /users/:userId - Eliminar usuario
          if (pathSegments.length === 2) {
            await this.userController.deleteUser(req, res, next);
          } else {
            this.sendNotFound(res, fullPath, method);
          }
          break;

        default:
          res.status(405).json({
            success: false,
            error: {
              message: 'Method not allowed',
              method: method,
              path: fullPath
            }
          });
      }
    } catch (error) {
      next(error);
    }
  };

  private sendNotFound(res: Response, path: string, method: string): void {
    res.status(404).json({
      success: false,
      error: {
        message: 'Endpoint not found',
        path,
        method
      }
    });
  }
}
