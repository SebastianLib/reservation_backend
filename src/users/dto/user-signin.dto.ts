import { IsEnum, IsNotEmpty, IsOptional, MinLength } from "class-validator";
import { ROLES } from "src/utility/common/user-roles.enum";

export class UserSignInDTO{
    @IsNotEmpty({message: "phone can't be null"})
    phone:string;

    @IsNotEmpty({message: "Password can't be null"})
    @MinLength(5, {message: "Password must be at least 5 characters"})
    password:string;

    @IsOptional()
    @IsEnum(ROLES, { message: "Rola musi być poprawną wartością enum" })
    role: ROLES;
}