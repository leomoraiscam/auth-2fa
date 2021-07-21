import { Router } from 'express';

import AuthenticatedUserController from '../../../../modules/auth/useCases/authenticateUser/authenticateController';

const authenticateRoutes = Router();
const authenticatedUserController = new AuthenticatedUserController();

authenticateRoutes.post('/sessions', authenticatedUserController.handle);

export default authenticateRoutes;
