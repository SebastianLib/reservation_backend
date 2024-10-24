import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class UserSignInDTO{
    @IsNotEmpty({message: "Email can't be null"})
    @IsEmail({}, {message: "Provide a valid email"})
    email:string;

    @IsNotEmpty({message: "Password can't be null"})
    @MinLength(5, {message: "Password must be at least 5 characters"})
    password:string;
}