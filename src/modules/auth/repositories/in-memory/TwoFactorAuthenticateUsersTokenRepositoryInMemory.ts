import { v4 as uuidv4 } from 'uuid';

import ICreateTwoFactorAuthenticateUserTokenDTO from '../../dtos/ICreateTwoFactorAuthenticateUserTokenDTO';
import TwoFactorAuthenticateUserToken from '../../infra/typeorm/entities/TwoFactorAuthenticateUserToken';
import ITwoFactorAuthenticateUserTokenRepository from '../ITwoFactorAuthenticateUsersTokenRepository';

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

  public async generate({
    user_id,
  }: ICreateTwoFactorAuthenticateUserTokenDTO): Promise<TwoFactorAuthenticateUserToken> {
    const twoFactorAuthenticateUserToken = new TwoFactorAuthenticateUserToken();

    Object.assign(twoFactorAuthenticateUserToken, {
      id: uuidv4(),
      user_id,
      token: uuidv4(),
    });

    this.twoFactorAuthenticateUserToken.push(twoFactorAuthenticateUserToken);

    return twoFactorAuthenticateUserToken;
  }

  public async save(
    twoFactorAuthenticateUserToken: TwoFactorAuthenticateUserToken
  ): Promise<TwoFactorAuthenticateUserToken> {
    const findIndex = this.twoFactorAuthenticateUserToken.findIndex(
      (existentUser) =>
        existentUser.user_id === twoFactorAuthenticateUserToken.user_id
    );

    this.twoFactorAuthenticateUserToken[findIndex] =
      twoFactorAuthenticateUserToken;

    return twoFactorAuthenticateUserToken;
  }
}

export default TwoFactorAuthenticateUsersTokens;
