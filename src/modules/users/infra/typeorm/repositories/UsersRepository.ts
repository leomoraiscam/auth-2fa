import { getRepository, Repository } from 'typeorm';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.repository.findOne(id);
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

  public async save(user: User): Promise<User> {
    return this.repository.save(user);
  }
}

export default UsersRepository;
