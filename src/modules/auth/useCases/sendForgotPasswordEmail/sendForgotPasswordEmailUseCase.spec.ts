import UserRepositoryInMemory from '@modules/users/repositories/in-memory/UserRepositoryInMemory';
import MailProviderInMemory from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import AppError from '@shared/errors/AppError';

import UsersTokenRepositoryInMemory from '../../repositories/in-memory/UsersTokenRepositoryInMemory';
import SendForgotPasswordEmailUseCase from './sendForgotPasswordEmailUseCase';

describe('Create User', () => {
  let userRepositoryInMemory: UserRepositoryInMemory;
  let mailProviderInMemory: MailProviderInMemory;
  let usersTokenRepositoryInMemory: UsersTokenRepositoryInMemory;
  let sendForgotPasswordEmail: SendForgotPasswordEmailUseCase;

  beforeEach(async () => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    mailProviderInMemory = new MailProviderInMemory();
    usersTokenRepositoryInMemory = new UsersTokenRepositoryInMemory();
    sendForgotPasswordEmail = new SendForgotPasswordEmailUseCase(
      userRepositoryInMemory,
      mailProviderInMemory,
      usersTokenRepositoryInMemory
    );
  });

  it('should be able to recover the password using the email', async () => {
    const spyMailProvider = jest.spyOn(mailProviderInMemory, 'sendMail');

    await userRepositoryInMemory.create({
      name: 'john doe',
      email: 'jondoe@example.com.br',
      password: 'P@ssw0rd',
    });

    await sendForgotPasswordEmail.execute({
      email: 'jondoe@example.com.br',
    });

    expect(spyMailProvider).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'jondoe@example.com.br',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const spyGenerateToken = jest.spyOn(
      usersTokenRepositoryInMemory,
      'generate'
    );

    const user = await userRepositoryInMemory.create({
      name: 'john doe',
      email: 'jondoe@example.com.br',
      password: 'P@ssw0rd',
    });

    await sendForgotPasswordEmail.execute({
      email: 'jondoe@example.com.br',
    });

    expect(spyGenerateToken).toHaveBeenCalledWith(user.id);
  });
});
