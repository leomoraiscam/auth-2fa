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

passwordRoutes.post('/sessions', authenticatedUserController.handle);
passwordRoutes.post('/forgot', sendForgotPasswordEmailController.handle);
passwordRoutes.post(
  '/2fa',
  validateTwoFactorAuthenticateTokenController.handle
);
passwordRoutes.post('/reset', resetPasswordController.handle);
export default passwordRoutes;
