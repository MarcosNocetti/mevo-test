import { ConflictException, Inject, Injectable } from "@nestjs/common"
import pgPromise from "pg-promise"
import pg from "pg-promise/typescript/pg-subset"
import { User } from "./user"


@Injectable()
export class UserRepository {
  constructor(@Inject('DbConnectionToken') private readonly db: pgPromise.IDatabase<{}, pg.IClient>) { }
  async findByUsername(name: string): Promise<User> {
    const result = await this.db.oneOrNone("SELECT name, password FROM users WHERE name = $1", [name])
    return result
  }

  async create(user: User): Promise<User> {
    try {
      const result = await this.db.oneOrNone("INSERT INTO public.users(name, password)VALUES($1, $2) RETURNING id, name;", [user.name, user.password])
      return result
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException()
      }
    }
  }

  async delete(userId: string): Promise<void> {
    await this.db.none("DELETE FROM public.users WHERE id = $1", [userId])
  }
}
