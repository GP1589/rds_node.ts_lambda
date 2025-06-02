import { Router } from 'express';
import { UserController } from '../../application/controllers/UserController';

export const createUserRoutes = (userController: UserController): Router => {
  const router = Router();
  
  router.post('/create', userController.createUser);
  router.get("/getAll", userController.getAllUsers);
  router.get('/getById/:userId', userController.getUserById);
  router.put('/update/:userId', userController.updateUser);
  router.delete('/delete/:userId', userController.deleteUser);

  return router;
};