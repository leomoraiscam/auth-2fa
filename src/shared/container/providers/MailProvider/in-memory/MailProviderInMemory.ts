import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../model/IMailProvider';

class MailProviderInMemory implements IMailProvider {
  private messages: ISendMailDTO[] = [];

  async sendMail(message: ISendMailDTO): Promise<void> {
    this.messages.push(message);
  }
}

export default MailProviderInMemory;
