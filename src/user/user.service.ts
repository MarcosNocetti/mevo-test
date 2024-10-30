import { Injectable } from "@nestjs/common";
import { UserRepository } from "../user/user.repository";
import * as bcrypt from 'bcryptjs';
import { User } from "./user";

@Injectable()
export class UserService {

  constructor( private readonly userRepository:UserRepository){}

  async findByUsername(name: string): Promise<User>{
    return this.userRepository.findByUsername(name)
  }

  async create(name: string, password: string): Promise<User>{	
    const user = { name: name, password: await this.hashPassword(password) };
    return this.userRepository.create(user)
  }

  
  async delete(userId: string): Promise<void>{	
    await this.userRepository.delete(userId)
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}