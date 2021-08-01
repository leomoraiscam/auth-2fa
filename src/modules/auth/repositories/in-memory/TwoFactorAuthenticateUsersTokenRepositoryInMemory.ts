import { v4 as uuidv4 } from 'uuid';

import ICreateTwoFactorAuthenticateUserTokenDTO from '../../dtos/ICreateTwoFactorAuthenticateUserTokenDTO';
import TwoFactorAuthenticateUserToken from '../../infra/typeorm/entities/TwoFactorAuthenticateUserToken';
import ITwoFactorAuthenticateUserTokenRepository from '../ITwoFactorAuthenticateUserTokenRepository';

class TwoFactorAuthenticateUsersTokens
  implements ITwoFactorAuthenticateUserTokenRepository
{
  private twoFactorAuthenticateUserToken: TwoFactorAuthenticateUserToken[] = [];

  public async findByUserId(
    user_id: string
  ): Promise<TwoFactorAuthenticateUserToken | undefined> {
    return this.twoFactorAuthenticateUserToken.find(
      (findToken) => findToken.user_id === user_id
    );
  }

  public async findByToken(
    token: string
  ): Promise<TwoFactorAuthenticateUserToken | undefined> {
    return this.twoFactorAuthenticateUserToken.find(
      (findToken) => findToken.token === token
    );
  }

  public async create({
    user_id,
    token,
  }: ICreateTwoFactorAuthenticateUserTokenDTO): Promise<TwoFactorAuthenticateUserToken> {
    const twoFactorAuthenticateUserToken = new TwoFactorAuthenticateUserToken();

    Object.assign(twoFactorAuthenticateUserToken, {
      id: uuidv4(),
      user_id,
      token,
    });

    this.twoFactorAuthenticateUserToken.push(twoFactorAuthenticateUserToken);

    return twoFactorAuthenticateUserToken;
  }

  public async save(
    twoFactorAuthenticateUserToken: TwoFactorAuthenticateUserToken
  ): Promise<void> {
    this.twoFactorAuthenticateUserToken.splice(
      this.twoFactorAuthenticateUserToken.findIndex(
        (existentUser) =>
          existentUser.user_id === twoFactorAuthenticateUserToken.user_id
      ),
      1,
      twoFactorAuthenticateUserToken
    );
  }
}

export default TwoFactorAuthenticateUsersTokens;
