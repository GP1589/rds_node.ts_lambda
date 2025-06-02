import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService";
import { User, CreateUserRequest } from "../../domain/entities/User";
import {
  NotFoundError,
  ValidationError,
} from "../../transversal/exceptions/AppError";
import { ResponseBuilder } from "../../transversal/common/ResponseBase";

export class UserController {
  constructor(private userService: UserService) {}

  createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, name, position }: CreateUserRequest = req.body;

      // Validación mejorada con detalles específicos
      const validationErrors: Record<string, string[]> = {};

      if (!email) validationErrors.email = ["Email is required"];
      if (!name) validationErrors.name = ["Name is required"];
      if (!position) validationErrors.position = ["Position is required"];

      // Validaciones adicionales
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        validationErrors.email = validationErrors.email || [];
        validationErrors.email.push("Email format is invalid");
      }

      if (Object.keys(validationErrors).length > 0) {
        ResponseBuilder.validationError(
          res,
          "Validation failed",
          validationErrors
        );
        return;
      }

      const user = await this.userService.createUser({ email, name, position });

      ResponseBuilder.created(res, user, "User created successfully");
    } catch (error) {
      if (error instanceof ValidationError) {
        ResponseBuilder.badRequest(res, error.message);
        return;
      }
      next(error);
    }
  };

  getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.params;

      // Validación de parámetro
      if (!userId || userId.trim() === "") {
        ResponseBuilder.badRequest(res, "User ID is required");
        return;
      }

      const user = await this.userService.getUserById(userId);

      if (!user) {
        ResponseBuilder.notFound(res, "User not found");
        return;
      }

      ResponseBuilder.success(res, user, "User retrieved successfully");
    } catch (error) {
      if (error instanceof NotFoundError) {
        ResponseBuilder.notFound(res, error.message);
        return;
      }
      next(error);
    }
  };

  getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Soporte para paginación opcional
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const search = req.query.search as string;

      // Validación de parámetros de paginación
      if (page < 1 || limit < 1 || limit > 100) {
        ResponseBuilder.badRequest(
          res,
          "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100"
        );
        return;
      }

      const users = await this.userService.getAllUsers();

      // Filtrado opcional por búsqueda
      let filteredUsers = users;
      if (search && search.trim() !== "") {
        const searchTerm = search.toLowerCase();
        filteredUsers = users.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.position.toLowerCase().includes(searchTerm)
        );
      }

      // Paginación manual (idealmente esto debería hacerse en el servicio/repositorio)
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      const responseData = {
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          total: filteredUsers.length,
          pages: Math.ceil(filteredUsers.length / limit),
          hasNext: endIndex < filteredUsers.length,
          hasPrev: page > 1,
        },
        ...(search && { searchTerm: search }),
      };

      ResponseBuilder.success(
        res,
        responseData,
        `Retrieved ${paginatedUsers.length} users successfully`
      );
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      // Validación de parámetro
      if (!userId || userId.trim() === "") {
        ResponseBuilder.badRequest(res, "User ID is required");
        return;
      }

      // Validación de datos a actualizar
      if (!updateData || Object.keys(updateData).length === 0) {
        ResponseBuilder.badRequest(res, "Update data is required");
        return;
      }

      // Validaciones específicas para campos que se pueden actualizar
      const validationErrors: Record<string, string[]> = {};

      if (
        updateData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)
      ) {
        validationErrors.email = ["Email format is invalid"];
      }

      if (updateData.name && updateData.name.trim() === "") {
        validationErrors.name = ["Name cannot be empty"];
      }

      if (updateData.position && updateData.position.trim() === "") {
        validationErrors.position = ["Position cannot be empty"];
      }

      if (Object.keys(validationErrors).length > 0) {
        ResponseBuilder.validationError(
          res,
          "Validation failed",
          validationErrors
        );
        return;
      }

      const user = await this.userService.updateUser(userId, updateData);

      if (!user) {
        ResponseBuilder.notFound(res, "User not found");
        return;
      }

      ResponseBuilder.success(res, user, "User updated successfully");
    } catch (error) {
      if (error instanceof NotFoundError) {
        ResponseBuilder.notFound(res, error.message);
        return;
      }
      if (error instanceof ValidationError) {
        ResponseBuilder.badRequest(res, error.message);
        return;
      }
      next(error);
    }
  };

  deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.params;

      // Validación de parámetro
      if (!userId || userId.trim() === "") {
        ResponseBuilder.badRequest(res, "User ID is required");
        return;
      }

      const deleted = await this.userService.deleteUser(userId);

      if (!deleted) {
        ResponseBuilder.notFound(res, "User not found");
        return;
      }

      // Para delete, puedes usar noContent() si prefieres no retornar data
      // ResponseBuilder.noContent(res);

      // O success con mensaje confirmatorio
      ResponseBuilder.success(
        res,
        { deletedUserId: userId },
        "User deleted successfully"
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        ResponseBuilder.notFound(res, error.message);
        return;
      }
      next(error);
    }
  };

}
