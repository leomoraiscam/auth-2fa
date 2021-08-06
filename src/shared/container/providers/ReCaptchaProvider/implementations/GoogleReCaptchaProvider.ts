import axios from 'axios';
import { injectable } from 'tsyringe';

import IReCaptchaProvider from '../models/IReCaptchaProvider';

@injectable()
class GoogleReCaptchaProvider implements IReCaptchaProvider {
  public async validate(token: string): Promise<boolean> {
    const url = `${process.env.GOOGLE_RECAPTCHA_URL}/siteverify?${process.env.GOOGLE_RECAPTCHA_SECRET}&response=${token}`;

    const { data } = await axios.get(url);

    return data.success;
  }
}

export default GoogleReCaptchaProvider;
