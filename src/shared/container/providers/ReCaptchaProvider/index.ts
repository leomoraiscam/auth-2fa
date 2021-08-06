import { container } from 'tsyringe';

import GoogleReCaptchaProvider from './implementations/GoogleReCaptchaProvider';
import IReCaptchaProvider from './models/IReCaptchaProvider';

container.registerSingleton<IReCaptchaProvider>(
  'ReCaptchaProvider',
  GoogleReCaptchaProvider
);
