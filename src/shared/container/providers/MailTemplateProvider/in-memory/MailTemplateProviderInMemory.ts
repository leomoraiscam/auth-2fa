import IMailTemplateProvider from '../models/IMailTemplateProvider';

class MailTemplateProviderInMemory implements IMailTemplateProvider {
  async parse(): Promise<string> {
    return 'Mail-content';
  }
}

export default MailTemplateProviderInMemory;
