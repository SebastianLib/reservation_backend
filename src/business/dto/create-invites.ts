import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateInvitesDTO {
    @IsNumber()
    @IsNotEmpty()
    quantity?: number;  

    @IsNumber()
    @IsNotEmpty()
    expirationTime?: number; 

    @IsString()
    @IsNotEmpty()
    businessId: string;
}