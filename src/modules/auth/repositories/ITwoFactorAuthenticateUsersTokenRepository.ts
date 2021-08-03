import ICreateTwoFactorAuthenticateUserDTO from '../dtos/ICreateTwoFactorAuthenticateUserTokenDTO';
import TwoFactorAuthenticateUserToken from '../infra/typeorm/entities/TwoFactorAuthenticateUserToken';

export default interface ITwoFactorAuthenticateUsersTokenRepository {
  findByUserId(
    user_id: string
  ): Promise<TwoFactorAuthenticateUserToken | undefined>;
  findByToken(
    token: string
  ): Promise<TwoFactorAuthenticateUserToken | undefined>;
  create(
    data: ICreateTwoFactorAuthenticateUserDTO
  ): Promise<TwoFactorAuthenticateUserToken>;
  save(
    twoFactorAuthenticateUserToken: TwoFactorAuthenticateUserToken
  ): Promise<void>;
}
