import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { ROLES } from "src/utility/common/user-roles.enum";

export class UserSignUpDTO{
    @IsNotEmpty({message: "Name can't be null"})
    @IsString({message: "Name should be a string"})
    name:string;

    @IsNotEmpty({message: "Surname can't be null"})
    @IsString({message: "Surname should be a string"})
    surname:string;

    @IsNotEmpty({message: "Phone can't be null"})
    @IsString({message: "Phone should be a string"})
    phone:string;
    
    @IsNotEmpty({message: "Email can't be null"})
    @IsEmail({}, {message: "Provide a valid email"})
    email:string;

    @IsNotEmpty({message: "Password can't be null"})
    @MinLength(5, {message: "Password must be at least 5 characters"})
    password:string;

    @IsOptional()
    @IsString({message: "Image should be a string"})
    image?: string;

    @IsOptional()
    @IsEnum(ROLES, { message: "Role must be a valid enum value" })
    role?: ROLES;
}