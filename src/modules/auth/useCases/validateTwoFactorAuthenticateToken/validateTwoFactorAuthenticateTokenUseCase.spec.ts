import AppError from '../../../../shared/errors/AppError';
import UserRepositoryInMemory from '../../../users/repositories/in-memory/UserRepositoryInMemory';
import CreateUserUseCase from '../../../users/useCases/createUser/createUserUseCase';
import TwoFactorAuthenticateUsersTokenRepositoryInMemory from '../../repositories/in-memory/TwoFactorAuthenticateUsersTokenRepositoryInMemory';
import ValidateTwoFactorAuthenticateTokenUseCase from './validateTwoFactorAuthenticateTokenUseCase';

describe('Create User', () => {
  let userRepositoryInMemory: UserRepositoryInMemory;
  let twoFactorAuthenticateUsersTokenRepositoryInMemory: TwoFactorAuthenticateUsersTokenRepositoryInMemory;
  let validateTwoFactorAuthenticateTokenUseCase: ValidateTwoFactorAuthenticateTokenUseCase;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(async () => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    twoFactorAuthenticateUsersTokenRepositoryInMemory =
      new TwoFactorAuthenticateUsersTokenRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(
      userRepositoryInMemory,
      twoFactorAuthenticateUsersTokenRepositoryInMemory
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
