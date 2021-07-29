import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from './resetPasswordUseCase';

class ResetPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body;

    const resetPassword = container.resolve(ResetPasswordService);

    await resetPassword.execute({ password, token });

    return response.status(204).json();
  }
}

export default ResetPasswordController;
