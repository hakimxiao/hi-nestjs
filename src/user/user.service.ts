import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from './user.logger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class UserService {
  constructor(private readonly logger: LoggerService) {}

  private users: User[] = [
    { id: 1, name: 'Abbu Solihin', email: 'hakim@gmail.com' },
    { id: 2, name: 'alhakim', email: 'abu@gmail.com' },
  ];

  findAllUsers(name: string = '') {
    this.logger.log('Finding all the user');

    return this.users.filter((user) =>
      user.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
    );
  }

  findUserById(id: number = 0) {
    const user = this.users.filter((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  createUser(dto: CreateUserDto) {
    this.logger.log('Creating user');

    const newUser: User = { id: this.users.length + 1, email: '', ...dto };
    this.users.push(newUser);

    return newUser;
  }

  updateUser(id: number, dto: UpdateUserDto) {
    this.logger.log(`Updating user ${id}`);

    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return null;

    this.users[index] = { ...this.users[index], ...dto };

    return this.users[index];
  }

  deleteUser(id: number) {
    this.logger.log(`Deleting user ${id}`);

    const index = this.users.findIndex((user) => user.id == id);
    if (index === -1) return null;

    const [deleted] = this.users.splice(index, 1);

    return deleted;
  }
}
