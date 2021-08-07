import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import AuthenticatedUserController from '@modules/auth/useCases/authenticateUser/authenticateUserController';
import ResetPasswordController from '@modules/auth/useCases/resetPasswordUser/resetPasswordUserController';
import SendForgotPasswordEmailController from '@modules/auth/useCases/sendForgotPasswordEmail/sendForgotPasswordEmailController';
import ValidateTwoFactorAuthenticateTokenController from '@modules/auth/useCases/validateTwoFactorAuthenticateToken/validateTwoFactorAuthenticateTokenController';

const passwordRoutes = Router();
const authenticatedUserController = new AuthenticatedUserController();
const sendForgotPasswordEmailController =
  new SendForgotPasswordEmailController();
const validateTwoFactorAuthenticateTokenController =
  new ValidateTwoFactorAuthenticateTokenController();
const resetPasswordController = new ResetPasswordController();

passwordRoutes.post(
  '/sessions',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      tokenReCaptcha: Joi.string().uuid(),
    },
  }),
  authenticatedUserController.handle
);
passwordRoutes.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      token: Joi.string().uuid(),
    },
  }),
  sendForgotPasswordEmailController.handle
);
passwordRoutes.post(
  '/2fa',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
    },
  }),
  validateTwoFactorAuthenticateTokenController.handle
);
passwordRoutes.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
    },
  }),
  resetPasswordController.handle
);
export default passwordRoutes;
