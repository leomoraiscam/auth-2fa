import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticatedUserUseCase from './authenticateUserUseCase';

class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password, tokenReCaptcha } = request.body;

    const authenticatedUserUseCase = container.resolve(
      AuthenticatedUserUseCase
    );

    const { user, token } = await authenticatedUserUseCase.execute({
      email,
      password,
      tokenReCaptcha,
    });

    return response.status(201).json({ user: classToClass(user), token });
  }
}

export default AuthenticateUserController;
