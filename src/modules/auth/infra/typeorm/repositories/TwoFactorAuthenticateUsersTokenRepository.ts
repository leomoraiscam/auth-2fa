import { getRepository, Repository } from 'typeorm';

import ICreateTwoFactorAuthenticateUserTokenDTO from '@modules/auth/dtos/ICreateTwoFactorAuthenticateUserTokenDTO';
import ITwoFactorAuthenticateUserTokenRepository from '@modules/auth/repositories/ITwoFactorAuthenticateUserTokenRepository';

import TwoFactorAuthenticateUserToken from '../entities/TwoFactorAuthenticateUserToken';

class TwoFactorAuthenticateUsersTokenRepository
  implements ITwoFactorAuthenticateUserTokenRepository
{
  private ormRepository: Repository<TwoFactorAuthenticateUserToken>;

  constructor() {
    this.ormRepository = getRepository(TwoFactorAuthenticateUserToken);
  }

  public async findByUserId(
    user_id: string
  ): Promise<TwoFactorAuthenticateUserToken | undefined> {
    return this.ormRepository.findOne({
      where: {
        user_id,
      },
    });
  }

  public async findByToken(
    token: string
  ): Promise<TwoFactorAuthenticateUserToken | undefined> {
    return this.ormRepository.findOne({
      where: {
        token,
      },
    });
  }

  public async create({
    token,
    user_id,
  }: ICreateTwoFactorAuthenticateUserTokenDTO): Promise<TwoFactorAuthenticateUserToken> {
    const userToken = this.ormRepository.create({
      token,
      user_id,
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }

  public async save(
    twoFactorAuthenticateUserToken: TwoFactorAuthenticateUserToken
  ): Promise<void> {
    await this.ormRepository.save(twoFactorAuthenticateUserToken);
  }
}

export default TwoFactorAuthenticateUsersTokenRepository;
