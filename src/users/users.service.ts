import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUpDTO } from './dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDTO } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async signup(body: UserSignUpDTO): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(body.email)
    if (userExists) throw new BadRequestException('Email is not available')
    body.password = await hash(body.password, 10)
    let user = this.usersRepository.create(body);
    user = await this.usersRepository.save(user)
    delete user.password
    return user;
  }

  async signin(userSignInDto: UserSignInDTO): Promise<UserEntity> {
    if (!userSignInDto.email || !userSignInDto.password) {
      throw new BadRequestException('Email and password must be provided');
    }
    
    const userExists = await this.usersRepository.createQueryBuilder('users')
      .addSelect("users.password")
      .where('users.email=:email', { email: userSignInDto.email })
      .getOne();
      
    if (!userExists) throw new BadRequestException('Bad Credentials')

    const matchPassword = await compare(userSignInDto.password, userExists.password)
    if (!matchPassword) throw new BadRequestException('Bad Credentials')

    delete userExists.password

    return userExists
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({id})
    if(!user) throw new NotFoundException("user not found")
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string){
    return await this.usersRepository.findOneBy({ email });
  }

  async accessToken(user: UserEntity): Promise<string> {
    return sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })
  }

}
