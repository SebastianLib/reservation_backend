import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class BusinessQuery {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    quantity?: string;  
  }
  