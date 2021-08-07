import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import CreateUserController from '@modules/users/useCases/createUser/createUserController';

const usersRoutes = Router();

const createUserController = new CreateUserController();

usersRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  createUserController.handle
);

export default usersRoutes;
