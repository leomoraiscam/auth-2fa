import AppError from '../../../../shared/errors/AppError';
import TwoFactorAuthenticateUsersTokenRepositoryInMemory from '../../../auth/repositories/in-memory/TwoFactorAuthenticateUsersTokenRepositoryInMemory';
import UserRepositoryInMemory from '../../repositories/in-memory/UserRepositoryInMemory';
import CreateUserUseCase from './createUserUseCase';

describe('Create User', () => {
  let userRepositoryInMemory: UserRepositoryInMemory;
  let twoFactorAuthenticateUsersTokenRepositoryInMemory: TwoFactorAuthenticateUsersTokenRepositoryInMemory;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(async () => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    twoFactorAuthenticateUsersTokenRepositoryInMemory =
      new TwoFactorAuthenticateUsersTokenRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(
      userRepositoryInMemory,
      twoFactorAuthenticateUsersTokenRepositoryInMemory
    );
  });

  it('should be able to create a user', async () => {
    const user = await createUserUseCase.execute({
      name: 'jonh doe',
      email: 'jonhdoe@email.com',
      password: '1234',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a user with same email', async () => {
    await userRepositoryInMemory.create({
      name: 'jonh doe',
      email: 'jonhdoe@email.com',
      password: '1234',
    });

    await expect(
      createUserUseCase.execute({
        name: 'jonh doe',
        email: 'jonhdoe@email.com',
        password: '1234',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
