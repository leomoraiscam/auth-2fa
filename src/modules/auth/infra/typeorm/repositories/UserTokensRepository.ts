import { getRepository, Repository } from 'typeorm';

import IUserTokensRepository from '../../../repositories/IUserTokenRepository';
import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const findUser = await this.ormRepository.findOne({
      where: {
        token,
      },
    });

    return findUser;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user_id,
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }
}

export default UserTokensRepository;