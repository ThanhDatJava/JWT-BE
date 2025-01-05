import { RewardsService } from './../modules/rewards/rewards.service';
import { CreateRewardDto } from './../modules/rewards/dto/create-reward.dto';
import { UsersService } from './../modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { comparePasswordHelper } from '@/helpers/util';
import { access } from 'fs';
import { JwtService } from '@nestjs/jwt';
import { DrinkService } from '@/modules/drink/drink.service';
import { CreateDrinkDto } from '@/modules/drink/dto/create-drink.dto';
import { HomeService } from '@/modules/home/home.service';
import { CreateHomeDto } from '@/modules/home/dto/create-home.dto';
import { UpdateHomeDto } from '@/modules/home/dto/update-home.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private drinkService: DrinkService,
    private jwtService: JwtService,
    private homeService: HomeService,
    private rewardsService: RewardsService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);

    // Check if user is null
    if (!user) {
      console.log('User not found');
      return null; // If user is null, return null to indicate failed authentication
    }

    // Validate password if user exists
    const isValidPassword = await comparePasswordHelper(pass, user.password);

    // Check if password is valid
    if (!isValidPassword) {
      console.log('Invalid password');
      return null; // If password is invalid, return null
    }

    // If both user and password are valid, return the user
    return user;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id };

    return {
      user: {
        email: user.email,
        _id: user._id,
        name: user.name,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  handleRegister = async (registerDto: CreateAuthDto) => {
    return await this.usersService.handleRegister(registerDto);
  };

  checkCode = async (data: CodeAuthDto) => {
    return await this.usersService.handleActive(data);
  };

  RetryAcitve = async (data: string) => {
    return await this.usersService.RetryAcitve(data);
  };

  RetryPassword = async (data: string) => {
    return await this.usersService.RetryPassword(data);
  };

  changePassword = async (data: ChangePasswordAuthDto) => {
    return await this.usersService.changePassword(data);
  };

  getDetailDrinkByName = async (name: string) => {
    return await this.drinkService.getDetailDrinkByName(name);
  };

  createDetailDrink = async (createDrinkDto: CreateDrinkDto) => {
    return await this.drinkService.createDetailDrink(createDrinkDto);
  };

  getListDrink = async () => {
    return await this.drinkService.getListDrink();
  };

  createDetailHomepage = async (createHomeDto: CreateHomeDto) => {
    return await this.homeService.createDetailHomepage(createHomeDto);
  };
  editDetailHomepage = async (updateHomeDto: UpdateHomeDto) => {
    return await this.homeService.editDetailHomepage(updateHomeDto);
  };
  deleteDetailHomepage = async (updateHomeDto: UpdateHomeDto) => {
    return await this.homeService.deleteDetailHomepage(updateHomeDto);
  };

  getListDetailHomepage = async () => {
    return await this.homeService.getListDetailHomepage();
  };

  createDetailReward = async (createRewardDto: CreateRewardDto) => {
    return await this.rewardsService.createDetailReward(createRewardDto);
  };

  getListDetailReward = async () => {
    return await this.rewardsService.getListDetailReward();
  };
}
