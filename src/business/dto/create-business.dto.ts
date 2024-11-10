import { IsString, IsNotEmpty, IsOptional, IsArray, IsUrl, IsNumber } from 'class-validator';
import { UserEntity } from 'src/users/entities/user.entity';

type OpenHour = {
  isOpen: boolean;
  open: string;
  close: string;
};

interface OpenHours {
  monday: OpenHour;
  tuesday: OpenHour;
  wednesday: OpenHour;
  thursday: OpenHour;
  friday: OpenHour;
  saturday: OpenHour;
  sunday: OpenHour;
}


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

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  categoriesIds: number[];

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
  // @IsUrl({}, { each: true })
  images?: string[];

  @IsNotEmpty()
  @IsNumber()
  ownerId: number; 

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })  
  workersIds?: number[];  

  @IsNotEmpty()
  openHours?:OpenHours
}