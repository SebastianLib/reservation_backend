import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBusinessDTO} from './dto/create-business.dto';
import { UpdateBusinessDTO } from './dto/update-business.dto';
import { BusinessEntity } from './entities/business.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(BusinessEntity)
    private readonly businessRepository: Repository<BusinessEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async create(createBusinessDto: CreateBusinessDTO): Promise<BusinessEntity> {
    const owner = await this.userRepository.findOne({ where: { id: createBusinessDto.ownerId } });

    if (!owner) {
      throw new NotFoundException('Użytkownik nie został znaleziony');
    }

    const workers = createBusinessDto.workersIds
      ? await Promise.all(createBusinessDto.workersIds.map(workerId =>
        this.userRepository.findOne({ where: { id: workerId } })
      ))
      : [];

    const business = this.businessRepository.create({
      ...createBusinessDto,
      owner,
      workers,
    });

    return await this.businessRepository.save(business);
  }


  async findAll(): Promise<BusinessEntity[]> {
    return await this.businessRepository.find({
        relations: {
            owner: true,
            workers: true,
        },
    });
}

  findOne(id: number): Promise<BusinessEntity> {
    return this.businessRepository.findOne({where:{
      id:id
    }});
  }

  async update(id: number, updateBusinessDto: UpdateBusinessDTO) {
    await this.businessRepository.update(id, updateBusinessDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.businessRepository.delete(id);
    return { deleted: true };
  }
}
