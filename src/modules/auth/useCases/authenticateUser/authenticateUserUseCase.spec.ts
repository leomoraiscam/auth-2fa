import AppError from '../../../../shared/errors/AppError';
import UserRepositoryInMemory from '../../../users/repositories/in-memory/UserRepositoryInMemory';
import CreateUserUseCase from '../../../users/useCases/createUser/createUserUseCase';
import AuthenticateUserUseCase from './authenticateUserUseCase';

describe('Create User', () => {
  let userRepositoryInMemory: UserRepositoryInMemory;
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(async () => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      userRepositoryInMemory
    );
  });

  it('should be able to authenticate an user with correct credentials', async () => {
    await createUserUseCase.execute({
      name: 'john doe',
      email: 'johndoe@email.com',
      password: '1234',
    });

    const response = await authenticateUserUseCase.execute({
      email: 'johndoe@email.com',
      password: '1234',
    });

    expect(response).toHaveProperty('token');
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
