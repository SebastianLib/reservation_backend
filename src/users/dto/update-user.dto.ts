import { IsEnum, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';
import { ROLES } from 'src/utility/common/user-roles.enum';
import { USER_STATUS } from 'src/utility/common/user-status.enum';

export class UpdateUserDTO {
    @IsOptional()
    @IsString()
    username?: string; 

    @IsOptional()
    @IsString()
    surname?: string; 

    @IsOptional()
    @IsString()
    phone?: string; 

    @IsOptional()
    @IsString()
    prefix?: string; 

    @IsOptional()
    @IsString()
    @Length(8) // Minimalna długość hasła, można zmodyfikować
    password?: string; 

    @IsOptional()
    @IsEnum(ROLES, { each: true }) 
    role?: ROLES[]; 

    @IsOptional()
    @IsString()
    image?: string; 

    @IsOptional()
    @IsEnum(USER_STATUS)
    status?: USER_STATUS; 

    @IsOptional()
    @IsString()
    @Length(4)
    verificationCode?: string | null; 
}