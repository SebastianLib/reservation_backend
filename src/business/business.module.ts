import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessEntity } from './entities/business.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { CategoryEntity } from 'src/categories/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BusinessEntity, UserEntity, CategoryEntity])
  ],
  controllers: [BusinessController], 
  providers: [BusinessService], 
  exports: [BusinessService],
})
export class BusinessModule {}
