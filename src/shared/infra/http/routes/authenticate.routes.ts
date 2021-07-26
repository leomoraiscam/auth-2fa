import { Router } from 'express';

import AuthenticatedUserController from '../../../../modules/auth/useCases/authenticateUser/authenticateController';
import SendForgotPasswordEmailController from '../../../../modules/auth/useCases/sendForgotPasswordEmail/sendForgotPasswordEmailController';

const passwordRoutes = Router();
const authenticatedUserController = new AuthenticatedUserController();
const sendForgotPasswordEmailController =
  new SendForgotPasswordEmailController();

passwordRoutes.post('/sessions', authenticatedUserController.handle);
passwordRoutes.post('/forgot', sendForgotPasswordEmailController.handle);

export default passwordRoutes;
