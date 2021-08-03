import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IValidateTwoFactorAuthenticateUserToken from '../../dtos/IValidateTwoFactorAuthenticateUserToken';
import ITwoFactorAuthenticateUsersTokenRepository from '../../repositories/ITwoFactorAuthenticateUsersTokenRepository';

@injectable()
class ValidateTwoFactorAuthenticateTokenUseCase {
  constructor(
    @inject('TwoFactorAuthenticateUsersTokenRepository')
    private twoFactorAuthenticateUserTokenRepository: ITwoFactorAuthenticateUsersTokenRepository
  ) {}

  async execute({
    token,
  }: IValidateTwoFactorAuthenticateUserToken): Promise<void> {
    const twoFactorUserToken =
      await this.twoFactorAuthenticateUserTokenRepository.findByToken(token);

    if (!twoFactorUserToken) {
      throw new AppError('Invalid 2fa token');
    }

    try {
      twoFactorUserToken.confirmation_register = true;

      await this.twoFactorAuthenticateUserTokenRepository.save(
        twoFactorUserToken
      );
    } catch (error) {
      throw new AppError('2fa token expired', 401);
    }
  }
}

export default ValidateTwoFactorAuthenticateTokenUseCase;
