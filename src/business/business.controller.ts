import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDTO } from './dto/create-business.dto';
import { UpdateBusinessDTO } from './dto/update-business.dto';
import { BusinessEntity } from './entities/business.entity';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { ROLES } from 'src/utility/common/user-roles.enum';
import { RequestWithUser } from 'src/models/api.model';
import { BusinessQuery } from './dto/business-query.dto';
import { CreateInvitesDTO } from './dto/create-invites';
import { InviteCodeEntity } from './entities/invite-code.entity';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) { }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([ROLES.ADMIN, ROLES.OWNER]))
  @Post()
  create(@Body() createBusinessDto: CreateBusinessDTO): Promise<BusinessEntity> {
    return this.businessService.create(createBusinessDto);
  }

  // @UseGuards(AuthenticationGuard, AuthorizeGuard([ROLES.WORKER]))
  @Get()
  findAll(): Promise<BusinessEntity[]> {
    return this.businessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<BusinessEntity> {
    return this.businessService.findOne(+id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: number): Promise<BusinessEntity[]> {
    return this.businessService.findByUserId(+userId);
  }

  // @UseGuards(AuthenticationGuard, AuthorizeGuard([ROLES.ADMIN, ROLES.OWNER]))
  @Post("invite")
  createInviteCodes(
    @Req() req: RequestWithUser, 
    @Body() createInvitesDto: CreateInvitesDTO
  ): Promise<InviteCodeEntity[]> {
    return this.businessService.createInviteCodes( req.currentUser.id, createInvitesDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBusinessDto: UpdateBusinessDTO) {
    return this.businessService.update(+id, updateBusinessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessService.remove(+id);
  }
}
