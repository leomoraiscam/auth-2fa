import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import AppError from '../../../../shared/errors/AppError';
import User from '../../../users/infra/typeorm/entities/User';
import IUserRepository from '../../../users/repositories/IUsersRepository';
import ITwoFactorAuthenticateUserTokenRepository from '../../repositories/ITwoFactorAuthenticateUserTokenRepository';

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
    private twoFactorAuthenticateUserTokenRepository: ITwoFactorAuthenticateUserTokenRepository
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const checkPassword = await compare(password, user.password);

    if (!checkPassword) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const userToken2Fa =
      await this.twoFactorAuthenticateUserTokenRepository.findByUserId(user.id);

    if (!userToken2Fa.confirmation_register) {
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
