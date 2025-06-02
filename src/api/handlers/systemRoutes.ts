import { Router } from 'express';
import { SystemController } from "../../application/controllers/SystemController";

export const createSystemRoutes = (systemController: SystemController): Router => {
  const router = Router();

  router.post("/create", systemController.create);
  router.get("/getAll", systemController.getAll);
  // router.get('/getById/:userId', systemController.getUserById);
  // router.put('/update/:userId', systemController.updateUser);
  // router.delete('/delete/:userId', systemController.deleteUser);

  return router;
};


