import { IsNotEmpty } from "class-validator"

export class User{
    id?: string
    @IsNotEmpty()
    name: string
    @IsNotEmpty()
    password: string
}