import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import AppError from '../../../../shared/errors/AppError';
import ITwoFactorAuthenticateUserTokenRepository from '../../../auth/repositories/ITwoFactorAuthenticateUserTokenRepository';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';
import User from '../../infra/typeorm/entities/User';
import IUserRepository from '../../repositories/IUsersRepository';

@injectable()
class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
    @inject('TwoFactorAuthenticateUsersTokenRepository')
    private twoFactorAuthenticateUserTokenRepository: ITwoFactorAuthenticateUserTokenRepository
  ) {}

  async execute({ name, email, password }: ICreateUserDTO): Promise<User> {
    const savedUser = await this.usersRepository.findByEmail(email);

    if (savedUser) {
      throw new AppError('user already exists', 409);
    }

    const hashPassword = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashPassword,
    });

    const token = sign({}, 'secret', {
      subject: String(user.id),
      expiresIn: '1d',
    });

    await this.twoFactorAuthenticateUserTokenRepository.create({
      user_id: user.id,
      token,
    });

    return user;
  }
}

export default CreateUserUseCase;
