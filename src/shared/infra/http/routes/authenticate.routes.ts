import { Router } from 'express';

import AuthenticatedUserController from '../../../../modules/auth/useCases/authenticateUser/authenticateController';
import SendForgotPasswordEmailController from '../../../../modules/auth/useCases/sendForgotPasswordEmail/sendForgotPasswordEmailController';
import ValidateTwoFactorAuthenticateTokenController from '../../../../modules/auth/useCases/validateTwoFactorAuthenticateToken/validateTwoFactorAuthenticateTokenController';

const passwordRoutes = Router();
const authenticatedUserController = new AuthenticatedUserController();
const sendForgotPasswordEmailController =
  new SendForgotPasswordEmailController();
const validateTwoFactorAuthenticateTokenController =
  new ValidateTwoFactorAuthenticateTokenController();

passwordRoutes.post('/sessions', authenticatedUserController.handle);
passwordRoutes.post('/forgot', sendForgotPasswordEmailController.handle);
passwordRoutes.post(
  '/2fa',
  validateTwoFactorAuthenticateTokenController.handle
);

export default passwordRoutes;
