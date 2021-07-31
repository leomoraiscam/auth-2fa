import UserRepositoryInMemory from '@modules/users/repositories/in-memory/UserRepositoryInMemory';
import AppError from '@shared/errors/AppError';

import UsersTokenRepositoryInMemory from '../../repositories/in-memory/UsersTokenRepositoryInMemory';
import ResetPasswordUseCase from './resetPasswordUserUseCase';

let userRepositoryInMemory: UserRepositoryInMemory;
let usersTokenRepositoryInMemory: UsersTokenRepositoryInMemory;
let resetPasswordUseCase: ResetPasswordUseCase;

describe('ResetPassword', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    usersTokenRepositoryInMemory = new UsersTokenRepositoryInMemory();

    resetPasswordUseCase = new ResetPasswordUseCase(
      userRepositoryInMemory,
      usersTokenRepositoryInMemory
    );
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordUseCase.execute({
        token: 'non-existing-token',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await usersTokenRepositoryInMemory.generate(
      'non-existing-user'
    );

    await expect(
      resetPasswordUseCase.execute({
        token,
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with passed more than 2 hours', async () => {
    const user = await userRepositoryInMemory.create({
      name: 'jonh doe',
      email: 'jondoe@example.com.br',
      password: '123456',
    });

    const { token } = await usersTokenRepositoryInMemory.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementation(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordUseCase.execute({
        token,
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
