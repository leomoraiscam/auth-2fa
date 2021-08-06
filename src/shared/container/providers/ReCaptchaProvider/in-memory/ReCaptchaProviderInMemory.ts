import IReCaptchaProvider from '../models/IReCaptchaProvider';

class InMemoryReCaptchaProvider implements IReCaptchaProvider {
  public async validate(token: string): Promise<boolean> {
    return token === 'valid-captcha';
  }
}

export default InMemoryReCaptchaProvider;
