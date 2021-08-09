import path from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';

import IUserRepository from '@modules/users/repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/model/IMailProvider';
import IReCaptchaProvider from '@shared/container/providers/ReCaptchaProvider/models/IReCaptchaProvider';
import AppError from '@shared/errors/AppError';

import IUserTokensRepository from '../../repositories/IUserTokenRepository';

interface IRequest {
  email: string;
  token?: string;
}

@injectable()
class SendForgotPasswordEmailUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
    @inject('ReCaptchaProvider')
    private reCaptchaProvider: IReCaptchaProvider
  ) {}

  async execute({ email, token: reCaptchaToken }: IRequest): Promise<void> {
    const max_forgot_password_attempts = 3;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exist', 400);
    }

    const { forgot_password_attempts } = user;

    if (forgot_password_attempts > max_forgot_password_attempts) {
      if (!reCaptchaToken) {
        throw new AppError('re-captcha-token', 401);
      }

      const success = await this.reCaptchaProvider.validate(reCaptchaToken);

      if (!success) {
        throw new AppError('too many requests to forgot password', 429);
      } else {
        user.forgot_password_attempts = 0;
      }
    } else {
      await this.usersRepository.save(
        Object.assign(user, {
          forgot_password_attempts: forgot_password_attempts + 1,
        })
      );
    }

    const userTokenExist = await this.userTokensRepository.findByUserId(
      user.id
    );

    if (userTokenExist) {
      userTokenExist.token = uuidv4();
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'users',
      'views',
      'forgot_password.hbs'
    );

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[2FA] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          token,
          link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailUseCase;
