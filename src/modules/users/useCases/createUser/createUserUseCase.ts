import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import path from 'path';
import { inject, injectable } from 'tsyringe';

import IMailProvider from '../../../../shared/container/providers/MailProvider/model/IMailProvider';
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
    private twoFactorAuthenticateUserTokenRepository: ITwoFactorAuthenticateUserTokenRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider
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

    const welcomeTemplate = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'welcome.hbs'
    );

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[2fa] Email de confirmação',
      templateData: {
        file: welcomeTemplate,
        variables: {
          name: user.name,
          token,
          link: `${process.env.APP_WEB_URL}/2fa?token=${token}`,
        },
      },
    });

    return user;
  }
}

export default CreateUserUseCase;
