import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './DTO/create-user.DTO';
import { UpdateUserDTO } from './DTO/update-user.DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUpDTO } from './DTO/user-signup.DTO';
import { hash, compare } from 'bcrypt';
import { UserSignInDTO } from './DTO/user-signin.DTO';
import { sign } from 'jsonwebtoken';
import { USER_STATUS } from 'src/utility/common/user-status.enum';
import { Twilio } from 'twilio';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) { }

  async signup(body: UserSignUpDTO): Promise<UserEntity> {
    const phonePrefix = body.phone.substring(0, 3);
    const phoneRest = body.phone.substring(3);

    const userExists = await this.usersRepository.createQueryBuilder('users')
      .where('users.phone = :phone', { phone: phoneRest })
      .andWhere('users.role = :role', { role: body.role })
      .getOne();


    if (userExists) throw new BadRequestException('Numer telefonu jest już zajęty');
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    body.password = await hash(body.password, 10);
    let user = this.usersRepository.create({
      ...body,
      verificationCode,
      phone: phoneRest,
      prefix: phonePrefix,
    });
    user = await this.usersRepository.save(user);
    delete user.password;

    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    //   await twilioClient.messages.create({
    //     body: `Twój kod weryfikacyjny to: ${verificationCode}`,
    //     from: '+14154939245',
    //     to: `${phonePrefix}${phoneRest}` 
    // });

    return user;
  }

  async signin(userSignInDTO: UserSignInDTO): Promise<UserEntity> {

    if (!userSignInDTO.phone || !userSignInDTO.password) {
      throw new BadRequestException('phone and password must be provided');
    }

    const userExists = await this.usersRepository.createQueryBuilder('users')
      .addSelect("users.password")
      .leftJoinAndSelect("users.ownedBusinesses", "ownedBusinesses")
      .leftJoinAndSelect("users.businesses", "businesses")
      .where('users.phone = :phone', { phone: userSignInDTO.phone })
      .andWhere('users.role = :role', { role: userSignInDTO.role })
      .getOne();

    if (!userExists) throw new BadRequestException('Bad Credentials');

    const matchPassword = await compare(userSignInDTO.password, userExists.password);
    if (!matchPassword) throw new BadRequestException('Bad Credentials');

    delete userExists.password;
    return userExists;
  }

  async verificationUser(id: number, code: string): Promise<boolean> {

    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Użytkownik nie został znaleziony');
    }
    if (user.verificationCode !== code) {
      throw new BadRequestException('Zły kod weryfikacyjny');
    }

    user.status = USER_STATUS.ACTIVATED;

    await this.usersRepository.save(user);

    return true;
  }

  create(createUserDTO: CreateUserDTO) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  update(id: number, updateUserDTO: UpdateUserDTO) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByPhone(phone: string) {
    return await this.usersRepository.findOneBy({ phone });
  }

  async accessToken(user: UserEntity): Promise<string> {
    return sign({ id: user.id, phone: user.phone }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME });
  }

}
