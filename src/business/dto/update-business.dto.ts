import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessDTO } from './create-business.dto';

export class UpdateBusinessDTO extends PartialType(CreateBusinessDTO) {}
