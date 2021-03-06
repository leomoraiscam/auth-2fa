import { container } from 'tsyringe';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import IMailProvider from './model/IMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
};

container.registerInstance<IMailProvider>('MailProvider', providers.ethereal);
