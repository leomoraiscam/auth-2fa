import TwoFactorAuthenticateUsersTokenRepositoryInMemory from '@modules/auth/repositories/in-memory/TwoFactorAuthenticateUsersTokenRepositoryInMemory';
import MailProviderInMemory from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import AppError from '@shared/errors/AppError';

import UserRepositoryInMemory from '../../repositories/in-memory/UserRepositoryInMemory';
import CreateUserUseCase from './createUserUseCase';

describe('Create User', () => {
  let userRepositoryInMemory: UserRepositoryInMemory;
  let twoFactorAuthenticateUsersTokenRepositoryInMemory: TwoFactorAuthenticateUsersTokenRepositoryInMemory;
  let mailProviderInMemory: MailProviderInMemory;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(async () => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    twoFactorAuthenticateUsersTokenRepositoryInMemory =
      new TwoFactorAuthenticateUsersTokenRepositoryInMemory();
    mailProviderInMemory = new MailProviderInMemory();
    createUserUseCase = new CreateUserUseCase(
      userRepositoryInMemory,
      twoFactorAuthenticateUsersTokenRepositoryInMemory,
      mailProviderInMemory
    );
  });

  it('should be able to create a user', async () => {
    const user = await createUserUseCase.execute({
      name: 'john doe',
      email: 'jonhdoe@email.com',
      password: '1234',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a user with same email', async () => {
    await userRepositoryInMemory.create({
      name: 'john doe',
      email: 'jonhdoe@email.com',
      password: '1234',
    });

    await expect(
      createUserUseCase.execute({
        name: 'john doe',
        email: 'jonhdoe@email.com',
        password: '1234',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
