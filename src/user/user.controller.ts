import { Controller, Post, Body, Delete} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() req: User) {
    const user = await this.userService.create(req.name, req.password);
    return user;
  }

  @Delete()
  async delete(@Body() req: User) {
    const user = await this.userService.delete(req.id);
    return user;
  }
}