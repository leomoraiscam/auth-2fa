import AppError from '../../../../shared/errors/AppError';
import UserRepositoryInMemory from '../../../users/repositories/in-memory/UserRepositoryInMemory';
import CreateUserUseCase from '../../../users/useCases/createUser/createUserUseCase';
import TwoFactorAuthenticateUsersTokenRepositoryInMemory from '../../repositories/in-memory/TwoFactorAuthenticateUsersTokenRepositoryInMemory';
import AuthenticateUserUseCase from './authenticateUserUseCase';

describe('Create User', () => {
  let userRepositoryInMemory: UserRepositoryInMemory;
  let twoFactorAuthenticateUsersTokenRepositoryInMemory: TwoFactorAuthenticateUsersTokenRepositoryInMemory;
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(async () => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    twoFactorAuthenticateUsersTokenRepositoryInMemory =
      new TwoFactorAuthenticateUsersTokenRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(
      userRepositoryInMemory,
      twoFactorAuthenticateUsersTokenRepositoryInMemory
    );
    authenticateUserUseCase = new AuthenticateUserUseCase(
      userRepositoryInMemory,
      twoFactorAuthenticateUsersTokenRepositoryInMemory
    );
  });

  it('should be able to authenticate an user with correct credentials and confirmation equals true value', async () => {
    const user = await createUserUseCase.execute({
      name: 'john doe',
      email: 'johndoe@email.com',
      password: '1234',
    });

    const tokenTwoFactorData =
      await twoFactorAuthenticateUsersTokenRepositoryInMemory.findByUserId(
        user.id
      );

    tokenTwoFactorData.confirmation_register = true;

    const response = await authenticateUserUseCase.execute({
      email: 'johndoe@email.com',
      password: '1234',
    });

    expect(response).toHaveProperty('token');
  });

  it('should be able to authenticate an user with correct credentials and confirmation false values', async () => {
    await createUserUseCase.execute({
      name: 'john doe',
      email: 'johndoe@email.com',
      password: '1234',
    });

    expect(
      authenticateUserUseCase.execute({
        email: 'johndoe@email.com',
        password: '1234',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate an user with wrong password', async () => {
    await createUserUseCase.execute({
      name: 'john doe',
      email: 'johndoe@email.com',
      password: '1234',
    });

    await expect(
      authenticateUserUseCase.execute({
        email: 'johndoe@email.com',
        password: '1234856',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to authenticate with non existing user', async () => {
    expect(
      authenticateUserUseCase.execute({
        email: 'jondoe@example.com.br',
        password: 'passW0rd',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
