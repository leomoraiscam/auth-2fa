import { getRepository, Repository } from 'typeorm';

import ICreateTwoFactorAuthenticateUserDTO from '../../../dtos/ICreateTwoFactorAuthenticateUserDTO';
import ITwoFactorAuthenticateUserTokenRepository from '../../../repositories/ITwoFactorAuthenticateUserTokenRepository';
import TwoFactorAuthenticateUserToken from '../entities/TwoFactorAuthenticateUserToken';

class TwoFactorAuthenticateUsersTokenRepository
  implements ITwoFactorAuthenticateUserTokenRepository
{
  private ormRepository: Repository<TwoFactorAuthenticateUserToken>;

  constructor() {
    this.ormRepository = getRepository(TwoFactorAuthenticateUserToken);
  }

  public async findByToken(
    token: string
  ): Promise<TwoFactorAuthenticateUserToken | undefined> {
    const findUser = await this.ormRepository.findOne({
      where: {
        token,
      },
    });

    return findUser;
  }

  async findByUserId(
    user_id: string
  ): Promise<TwoFactorAuthenticateUserToken | undefined> {
    const twoFactorAuthenticateUserToken = this.ormRepository.findOne({
      where: {
        user_id,
      },
    });

    return twoFactorAuthenticateUserToken;
  }

  public async create({
    token,
    user_id,
  }: ICreateTwoFactorAuthenticateUserDTO): Promise<TwoFactorAuthenticateUserToken> {
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
