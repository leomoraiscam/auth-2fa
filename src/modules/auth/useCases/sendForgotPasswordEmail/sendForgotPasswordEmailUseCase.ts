import path from 'path';
import { inject, injectable } from 'tsyringe';

import IMailProvider from '../../../../shared/container/providers/MailProvider/model/IMailProvider';
import AppError from '../../../../shared/errors/AppError';
import IUserRepository from '../../../users/repositories/IUsersRepository';
import IUserTokensRepository from '../../repositories/IUserTokenRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository
  ) {}

  async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exist', 400);
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    const forgotPasswordtemplate = path.resolve(
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
      subject: '[2fa] Recuperação de senha',
      templateData: {
        file: forgotPasswordtemplate,
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