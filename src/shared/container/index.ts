import { container } from 'tsyringe';
import './providers';

import UserTokensRepository from '../../modules/auth/infra/typeorm/repositories/UserTokensRepository';
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
