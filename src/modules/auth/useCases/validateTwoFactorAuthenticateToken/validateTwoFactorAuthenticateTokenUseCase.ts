import { verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IValidate2faToken from '../../dtos/IValidate2faToken';
import ITwoFactorAuthenticateUserTokenRepository from '../../repositories/ITwoFactorAuthenticateUserTokenRepository';

@injectable()
class ValidateTwoFactorAuthenticateTokenUseCase {
  constructor(
    @inject('TwoFactorAuthenticateUsersTokenRepository')
    private twoFactorAuthenticateUserTokenRepository: ITwoFactorAuthenticateUserTokenRepository
  ) {}

  async execute({ token }: IValidate2faToken): Promise<void> {
    const savedUser =
      await this.twoFactorAuthenticateUserTokenRepository.findByToken(token);

    if (!savedUser) {
      throw new AppError('Invalid 2fa token');
    }

    try {
      await verify(token, 'secret');

      savedUser.token = null;
      savedUser.confirmation_register = true;

      await this.twoFactorAuthenticateUserTokenRepository.save(savedUser);
    } catch (error) {
      throw new AppError('2fa token expired', 401);
    }
  }
}

export default ValidateTwoFactorAuthenticateTokenUseCase;
