import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  @Get()
  getUser(@Query('name') name: string) {
    const users = [
      { id: 1, name: 'Jhon Doe' },
      { id: 2, name: 'Hakim' },
    ];

    if (name) {
      return users.filter((user) =>
        user.name.toLowerCase().includes(name.toLowerCase()),
      );
    }

    return users;
  }
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return { id, name: 'John Doe' };
  }
  @Post()
  createUser(@Body() CreateUserDto: CreateUserDto) {
    return { data: CreateUserDto, message: 'User created successfully' };
  }
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() UpdateUserDto: UpdateUserDto) {
    return {
      data: { id, ...UpdateUserDto },
      message: 'User updated successfully',
    };
  }
}
