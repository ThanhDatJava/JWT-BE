import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { LocalAuthGuard } from './passport/local-auth.guard';

import { Public, ResponseMessage } from '@/decorator/customize';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateDrinkDto } from '@/modules/drink/dto/create-drink.dto';
import { CreateHomeDto } from '@/modules/home/dto/create-home.dto';
import { CreateRewardDto } from '@/modules/rewards/dto/create-reward.dto';
import { UpdateHomeDto } from '@/modules/home/dto/update-home.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Fetch login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Post('check-code')
  @Public()
  checkCode(@Body() registerDto: CodeAuthDto) {
    return this.authService.checkCode(registerDto);
  }

  @Post('retry-active')
  @Public()
  RetryAcitve(@Body('email') email: string) {
    return this.authService.RetryAcitve(email);
  }

  @Post('retry-password')
  @Public()
  RetryPassword(@Body('email') email: string) {
    return this.authService.RetryPassword(email);
  }

  @Post('change-password')
  @Public()
  changePassword(@Body() data: ChangePasswordAuthDto) {
    return this.authService.changePassword(data);
  }

  @Get('mail')
  @Public()
  testMail() {
    this.mailerService
      .sendMail({
        to: 'thanhdatjava@gmail.com', // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        template: 'register.hbs',
        context: {
          name: 'ThanhDat',
          activationCode: '007',
        },
      })
      .then(() => {})
      .catch(() => {});
    return 'ok';
  }

  @Post('get-detail-drink-by-name')
  @Public()
  getDetailDrinkByName(@Body('name') name: string) {
    return this.authService.getDetailDrinkByName(name);
  }

  @Post('create-detail-drink')
  @Public()
  createDetailDrink(@Body() createDrinkDto: CreateDrinkDto) {
    return this.authService.createDetailDrink(createDrinkDto);
  }

  @Get('get-list-drink')
  @Public()
  getListDrink() {
    return this.authService.getListDrink();
  }

  @Get('get-list-detail-homepage')
  @Public()
  getListDetailHomepage() {
    return this.authService.getListDetailHomepage();
  }

  @Post('create-detail-homepage')
  @Public()
  createDetailHomepage(@Body() createHomeDto: CreateHomeDto) {
    return this.authService.createDetailHomepage(createHomeDto);
  }

  @Post('edit-detail-homepage')
  @Public()
  editDetailHomepage(@Body() updateHomeDto: UpdateHomeDto) {
    return this.authService.editDetailHomepage(updateHomeDto);
  }

  @Post('delete-detail-homepage')
  @Public()
  deleteDetailHomepage(@Body() updateHomeDto: UpdateHomeDto) {
    return this.authService.deleteDetailHomepage(updateHomeDto);
  }

  @Post('create-detail-reward')
  @Public()
  createDetailReward(@Body() createRewardDto: CreateRewardDto) {
    return this.authService.createDetailReward(createRewardDto);
  }

  @Get('get-list-detail-reward')
  @Public()
  getListDetailReward() {
    return this.authService.getListDetailReward();
  }
}
