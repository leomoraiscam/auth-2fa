import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ValidateTwoFactorAuthenticateTokenUseCase from './validateTwoFactorAuthenticateTokenUseCase';

class ValidateTwoFactorAuthenticateTokenController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.body;

    const validateTwoFactorAuthenticateTokenUseCase = container.resolve(
      ValidateTwoFactorAuthenticateTokenUseCase
    );

    const tokenData = await validateTwoFactorAuthenticateTokenUseCase.execute({
      token,
    });

    return response.status(201).json(tokenData);
  }
}

export default ValidateTwoFactorAuthenticateTokenController;
