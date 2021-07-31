import UserRepositoryInMemory from '@modules/users/repositories/in-memory/UserRepositoryInMemory';
import CreateUserUseCase from '@modules/users/useCases/createUser/createUserUseCase';
import MailProviderInMemory from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import AppError from '@shared/errors/AppError';

import TwoFactorAuthenticateUsersTokenRepositoryInMemory from '../../repositories/in-memory/TwoFactorAuthenticateUsersTokenRepositoryInMemory';
import ValidateTwoFactorAuthenticateTokenUseCase from './validateTwoFactorAuthenticateTokenUseCase';

describe('Create User', () => {
  let userRepositoryInMemory: UserRepositoryInMemory;
  let twoFactorAuthenticateUsersTokenRepositoryInMemory: TwoFactorAuthenticateUsersTokenRepositoryInMemory;
  let mailProviderInMemory: MailProviderInMemory;
  let validateTwoFactorAuthenticateTokenUseCase: ValidateTwoFactorAuthenticateTokenUseCase;
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
    validateTwoFactorAuthenticateTokenUseCase =
      new ValidateTwoFactorAuthenticateTokenUseCase(
        twoFactorAuthenticateUsersTokenRepositoryInMemory
      );
  });

  it('should return a unauthorized exception if no user was found for the given token', async () => {
    await expect(
      validateTwoFactorAuthenticateTokenUseCase.execute({
        token: 'validate2FAToken',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should return a unauthorized exception if the provided token is invalid', async () => {
    const user = await userRepositoryInMemory.create({
      name: 'john doe',
      email: 'jonhdoe@email.com',
      password: '1234',
    });

    const userToken =
      await twoFactorAuthenticateUsersTokenRepositoryInMemory.create({
        token: 'token',
        user_id: user.id,
      });

    userToken.token = 'validate2FAToken';

    await twoFactorAuthenticateUsersTokenRepositoryInMemory.save(userToken);

    await expect(
      validateTwoFactorAuthenticateTokenUseCase.execute({
        token: 'invalid-JWT-token',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
