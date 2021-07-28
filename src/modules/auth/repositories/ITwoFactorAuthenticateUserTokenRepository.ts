import ICreateTwoFactorAuthenticateUserDTO from '../dtos/ICreateTwoFactorAuthenticateUserDTO';
import TwoFactorAuthenticateUserToken from '../infra/typeorm/entities/TwoFactorAuthenticateUserToken';

export default interface IUserTokensRepository {
  findByToken(
    token: string
  ): Promise<TwoFactorAuthenticateUserToken | undefined>;
  findByUserId(
    user_id: string
  ): Promise<TwoFactorAuthenticateUserToken | undefined>;
  create(
    data: ICreateTwoFactorAuthenticateUserDTO
  ): Promise<TwoFactorAuthenticateUserToken>;
  save(
    twoFactorAuthenticateUserToken: TwoFactorAuthenticateUserToken
  ): Promise<void>;
}
