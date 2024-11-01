import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { ROLES } from "src/utility/common/user-roles.enum";

export class UserSignUpDTO {
    @IsNotEmpty({ message: "Imię nie może być puste" })
    @IsString({ message: "Imię powinno być tekstem" })
    username: string;

    @IsNotEmpty({ message: "Nazwisko nie może być puste" })
    @IsString({ message: "Nazwisko powinno być tekstem" })
    surname: string;

    @IsNotEmpty({ message: "Numer telefonu nie może być pusty" })
    @IsString({ message: "Numer telefonu powinien być tekstem" })
    phone: string;

    @IsNotEmpty({ message: "Hasło nie może być puste" })
    @MinLength(5, { message: "Hasło musi mieć co najmniej 5 znaków" })
    password: string;

    @IsOptional()
    @IsString({ message: "Obraz powinien być tekstem" })
    image?: string;

    @IsOptional()
    @IsEnum(ROLES, { message: "Rola musi być poprawną wartością enum" })
    role: ROLES;
}
