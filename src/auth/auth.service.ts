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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
}
