import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateBusinessDTO } from './dto/create-business.dto';
import { UpdateBusinessDTO } from './dto/update-business.dto';
import { BusinessEntity } from './entities/business.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { FileEntity } from 'src/uploads/entities/upload.entity';
import { InviteCodeEntity } from './entities/invite-code.entity';
import { BusinessQuery } from './dto/business-query.dto';
import { CreateInvitesDTO } from './dto/create-invites';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(BusinessEntity)
    private readonly businessRepository: Repository<BusinessEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
    @InjectRepository(InviteCodeEntity)
    private inviteCodeRepository: Repository<InviteCodeEntity>,
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


    const categories = await this.categoryRepository.findBy({
      id: In(createBusinessDto.categoriesIds),
    });

    if (categories.length !== createBusinessDto.categoriesIds.length) {
      throw new NotFoundException('One or more categories not found');
    }

    const business = this.businessRepository.create({
      ...createBusinessDto,
      owner,
      workers,
      categories,
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

  async findOne(id: number): Promise<BusinessEntity> {
    return await this.businessRepository.findOne({
      where: {
        id: id
      }
    });
  }

  async findByUserId(userId: number): Promise<BusinessEntity[]> {
    const businesses = await this.businessRepository.createQueryBuilder("business")
      .leftJoinAndSelect("business.owner", "owner")
      .leftJoinAndSelect("business.workers", "worker")
      .where("owner.id = :userId OR worker.id = :userId", { userId })
      .getMany();
  
    for (const business of businesses) {
      if (business.images && business.images.length > 0) {
        const imageFiles = await this.fileRepository.findByIds(business.images);
        business.images = imageFiles.map(file => file.filename);
      }
    }
    
    return businesses;
  }
  

  async createInviteCodes(userId: number, createInvitesDto: CreateInvitesDTO): Promise<InviteCodeEntity[]> {
    const owner = await this.userRepository.findOne({ where: { id: userId } });

    if (!owner) {
      throw new NotFoundException('Użytkownik nie został znaleziony');
    }

    const business = await this.businessRepository.findOne({
      where: { id: Number(createInvitesDto.businessId) },
      relations: ['owner'],
    });

    if (!business || business.owner.id !== owner.id) {
      throw new NotFoundException('Biznes nie znaleziony');
    }


    const inviteCodes = generateRandomCodes(createInvitesDto.quantity);
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + Number(createInvitesDto.expirationTime));

    const inviteEntities = inviteCodes.map((code) =>
      this.inviteCodeRepository.create({
        inviteCode: code,
        expirationTime,
        business,
      })
    );
    await this.inviteCodeRepository.save(inviteEntities);

    return inviteEntities;
  }
  async getInviteCodes(userId: number, businessId: number): Promise<InviteCodeEntity[]> {
    const owner = await this.userRepository.findOne({ where: { id: userId } });

    if (!owner) {
      throw new NotFoundException('Użytkownik nie został znaleziony');
    }

    const business = await this.businessRepository.findOne({ where: { id: businessId } });

    if (!business) {
      throw new NotFoundException('Salon nie został znaleziony');
    }

    const invites = await this.inviteCodeRepository
      .createQueryBuilder('invite')
      .where('invite.businessId = :businessId', { businessId: business.id })
      .getMany();

    if (!invites || invites.length === 0) {
      throw new NotFoundException('Brak zaproszeń dla tego salonu');
    }

    return invites;
  }

  async joinToBusiness(userId: number, code: string): Promise<BusinessEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Użytkownik nie został znaleziony');
    }

    const inviteCodeEntity = await this.inviteCodeRepository.findOne({
      where: { inviteCode: code },
      relations: ['business'],
    });
    
    if (!inviteCodeEntity) {
      throw new NotFoundException('Nie znaleziono kodu zaproszenia');
    }

    if (inviteCodeEntity.expirationTime < new Date()) {
      throw new BadRequestException('Kod zaproszenia wygasł');
    }
    
    const business = inviteCodeEntity.business;
    
    const isAlreadyWorker = business.workers.some(worker => worker.id === user.id);
    if (isAlreadyWorker || business.owner.id === userId) {
      throw new BadRequestException('Użytkownik jest już pracownikiem tego biznesu');
    }

    business.workers = [...(business.workers || []), user];

   return await this.businessRepository.save(business);
  }


  async update(id: number, updateBusinessDto: UpdateBusinessDTO) {
    await this.businessRepository.update(id, updateBusinessDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.businessRepository.delete(id);
    return { deleted: true };
  }



  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeExpiredInviteCodes(): Promise<void> {
    await this.inviteCodeRepository
      .createQueryBuilder()
      .delete()
      .where('expirationTime <= CURRENT_TIMESTAMP')
      .execute();
  }
}

const generateRandomCodes = (quantity: number = 1): string[] => {
  const codes: string[] = [];
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < quantity; i++) {
    let code = '';
    for (let j = 0; j < 8; j++) {
      code += characters[Math.floor(Math.random() * characters.length)];
    }
    codes.push(code);
  }
  return codes;
}

