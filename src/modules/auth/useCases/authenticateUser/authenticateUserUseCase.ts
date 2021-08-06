import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import IReCaptchaProvider from '@shared/container/providers/ReCaptchaProvider/models/IReCaptchaProvider';
import AppError from '@shared/errors/AppError';

import ITwoFactorAuthenticateUsersTokenRepository from '../../repositories/ITwoFactorAuthenticateUsersTokenRepository';

interface IRequest {
  email: string;
  password: string;
  tokenReCaptcha?: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
    @inject('TwoFactorAuthenticateUsersTokenRepository')
    private twoFactorAuthenticateUserTokenRepository: ITwoFactorAuthenticateUsersTokenRepository,
    @inject('ReCaptchaProvider')
    private reCaptchaProvider: IReCaptchaProvider
  ) {}

  async execute({
    email,
    password,
    tokenReCaptcha,
  }: IRequest): Promise<IResponse> {
    const max_sign_in_attempts = 3;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const { sign_in_attempts } = user;

    if (sign_in_attempts > max_sign_in_attempts) {
      if (!tokenReCaptcha) {
        throw new AppError('re-captcha-token', 401);
      }

      const success = await this.reCaptchaProvider.validate(tokenReCaptcha);

      if (!success) {
        throw new AppError('too many requests to session', 429);
      }
    }

    const checkMatchedPassword = await compare(password, user.password);

    if (!checkMatchedPassword) {
      await this.usersRepository.save(
        Object.assign(user, {
          sign_in_attempts: sign_in_attempts + 1,
        })
      );

      throw new AppError('Incorrect email/password combination', 401);
    }

    const twoFactorUserToken =
      await this.twoFactorAuthenticateUserTokenRepository.findByUserId(user.id);

    if (!twoFactorUserToken.confirmation_register) {
      throw new AppError('Confirmed Registration is missing', 401);
    }

    const token = sign({}, 'secret', {
      subject: String(user.id),
      expiresIn: '1d',
    });

    await this.usersRepository.save(
      Object.assign(user, {
        signInAttempts: 0,
      })
    );

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserUseCase;
