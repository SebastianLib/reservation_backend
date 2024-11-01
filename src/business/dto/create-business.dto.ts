import { IsString, IsNotEmpty, IsOptional, IsArray, IsUrl, IsNumber } from 'class-validator';
import { UserEntity } from 'src/users/entities/user.entity';

export class CreateBusinessDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  buildingNumber: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @IsNotEmpty()
  @IsNumber()
  ownerId: number; 

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })  
  workersIds?: number[];  
}