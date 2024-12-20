import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserSignUpDTO } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDTO } from './dto/user-signin.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post("signup")
  async signup(@Body() body:UserSignUpDTO):Promise<UserEntity>{
        
    return await this.usersService.signup(body)
  }

  @Post("signin")
  async signin(@Body() userSignInDto:UserSignInDTO): Promise<{
    accessToken:string,
    user: UserEntity
  }>{
    
   const user = await this.usersService.signin(userSignInDto)
   const accessToken = await this.usersService.accessToken(user);
   return {accessToken, user}
  }

  @Patch('verification/:id/:code')
  async verificationUser(@Param('id') id: number, @Param('code') code: string): Promise<boolean> {
    return await this.usersService.verificationUser(id, code);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDTO) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get("me")
  getProfile(@CurrentUser() currentUser:UserEntity){
    return currentUser
  }
}
