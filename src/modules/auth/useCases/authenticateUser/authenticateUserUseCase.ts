import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

import ITwoFactorAuthenticateUsersTokenRepository from '../../repositories/ITwoFactorAuthenticateUsersTokenRepository';

interface IRequest {
  email: string;
  password: string;
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
    private twoFactorAuthenticateUserTokenRepository: ITwoFactorAuthenticateUsersTokenRepository
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const checkMatchedPassword = await compare(password, user.password);

    if (!checkMatchedPassword) {
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

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserUseCase;
