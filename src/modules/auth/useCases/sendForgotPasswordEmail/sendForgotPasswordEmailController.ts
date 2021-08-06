import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswordEmailUseCase from './sendForgotPasswordEmailUseCase';

class SendForgotPasswordEmailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, token } = request.body;

    const forgotPassword = container.resolve(SendForgotPasswordEmailUseCase);

    await forgotPassword.execute({ email, token });

    return response.status(204).json();
  }
}

export default SendForgotPasswordEmailController;
