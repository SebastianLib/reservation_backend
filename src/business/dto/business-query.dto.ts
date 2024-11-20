import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class BusinessQuery {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    quantity?: string;  

    @IsOptional()
    @IsDateString()
    expirationTime?: string; 

    @IsOptional()
    @IsString()
    businessId?: number; 
  }
  