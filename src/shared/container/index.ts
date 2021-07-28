import { container } from 'tsyringe';
import './providers';

import TwoFactorAuthenticateUsersTokenRepository from '../../modules/auth/infra/typeorm/repositories/TwoFactorAuthenticateUsersTokenRepository';
import UserTokensRepository from '../../modules/auth/infra/typeorm/repositories/UserTokensRepository';
import ITwoFactorAuthenticateUserTokenRepository from '../../modules/auth/repositories/ITwoFactorAuthenticateUserTokenRepository';
import IUserTokenRepository from '../../modules/auth/repositories/IUserTokenRepository';
import UsersRepository from '../../modules/users/infra/typeorm/repositories/UsersRepository';
import IUsersRepository from '../../modules/users/repositories/IUsersRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
);

container.registerSingleton<IUserTokenRepository>(
  'UserTokensRepository',
  UserTokensRepository
);

container.registerSingleton<ITwoFactorAuthenticateUserTokenRepository>(
  'TwoFactorAuthenticateUsersTokenRepository',
  TwoFactorAuthenticateUsersTokenRepository
);
