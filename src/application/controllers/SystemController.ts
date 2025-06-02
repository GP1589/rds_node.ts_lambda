import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService";
import { SystemService } from "../services/SystemService";

import { User, CreateUserRequest } from "../../domain/entities/User";
import {
  NotFoundError,
  ValidationError,
} from "../../transversal/exceptions/AppError";
import { ResponseBuilder } from "../../transversal/common/ResponseBase";
import { System } from "@prisma/client";

export class SystemController {
  constructor(private systemService: SystemService) {}

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const systemData : System = req.body;

      const system = await this.systemService.create(systemData);

      ResponseBuilder.created(res, system, "System created successfully");
    } catch (error) {
      if (error instanceof ValidationError) {
        ResponseBuilder.badRequest(res, error.message);
        return;
      }
      next(error);
    }
  };

  
  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {

      const systems = await this.systemService.getAll();
      ResponseBuilder.success(
        res,
        systems,
        `Retrieved systems successfully`
      );
    } catch (error) {
      next(error);
    }
  };

}
