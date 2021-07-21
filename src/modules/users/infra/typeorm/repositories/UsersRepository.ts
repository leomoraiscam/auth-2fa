import { getRepository, Repository } from 'typeorm';

import ICreateUserDTO from '../../../dtos/ICreateUserDTO';
import IUserRepository from '../../../repositories/IUsersRepository';
import User from '../entities/User';

class UsersRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({
      where: {
        email,
      },
    });
  }

  async create({ name, email, password }: ICreateUserDTO): Promise<User> {
    const user = this.repository.create({
      name,
      email,
      password,
    });

    await this.repository.save(user);

    return user;
  }
}

export default UsersRepository;
