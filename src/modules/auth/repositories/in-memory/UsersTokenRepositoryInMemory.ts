import { v4 as uuidv4 } from 'uuid';

import UserToken from '../../infra/typeorm/entities/UserToken';
import IUserTokenRepository from '../IUserTokenRepository';

class UserTokensRepositoryInMemory implements IUserTokenRepository {
  private usersTokens: UserToken[] = [];

  public async findByToken(token: string): Promise<UserToken | undefined> {
    return this.usersTokens.find((findToken) => findToken.token === token);
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuidv4(),
      token: uuidv4(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.usersTokens.push(userToken);

    return userToken;
  }
}

export default UserTokensRepositoryInMemory;
