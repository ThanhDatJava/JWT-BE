import { User } from '@/modules/users/schemas/user.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util'; // Assuming your utility file is correct
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SortOrder } from 'mongoose';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModal: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  isEmailExist = async (email: string) => {
    const user = await this.userModal.exists({ email });
    if (user) return true;
    return false;
  };
  // Create a new user
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto;

    // check email
    const isExist = await this.isEmailExist(email);

    if (isExist) {
      throw new BadRequestException(
        `Email ${email} đã tồn tại. vui lòng nhập email khác !`,
      );
    }

    // Hash the password asynchronously and await the result
    const hashedPassword = await hashPasswordHelper(password); // Await the hashed password

    // Create the user with the hashed password
    const user = await this.userModal.create({
      name,
      email,
      password: hashedPassword, // Use the resolved hashed password
      phone,
      address,
      image,
    });

    // Return the user's _id after creation
    return {
      _id: user._id,
    };
  }

  async findAll(
    query: string,
    current: number = 1,
    pageSize: number = 10,
  ): Promise<{
    results: User[];
    meta: { current: number; pageSize: number; pages: number; total: number };
  }> {
    // Parse the query parameters using `aqp`
    const { filter, sort } = aqp(query);

    // Exclude pagination parameters from the filter
    delete filter.current;
    delete filter.pageSize;

    // Calculate the skip value for pagination
    const skip = (current - 1) * pageSize;

    // Get the total number of documents matching the filter
    const totalItems = await this.userModal.countDocuments(filter);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItems / pageSize);

    // Ensure that `sort` is in the correct format for MongoDB (should be an object like { fieldName: 1 })
    const sortObject: { [key: string]: SortOrder } = {};

    // Transform `sort` if needed (ensure sort is a valid object)
    if (sort && typeof sort === 'object') {
      for (const field in sort) {
        if (sort.hasOwnProperty(field)) {
          // MongoDB expects '1' for ascending and '-1' for descending
          sortObject[field] = sort[field] === 1 ? 'asc' : 'desc';
        }
      }
    }

    // Fetch paginated results with applied filters, sort, and pagination
    const results = await this.userModal
      .find(filter)
      .skip(skip)
      .limit(pageSize)
      .select('-password') // Exclude password field
      .sort(sortObject);

    return {
      results,
      meta: {
        current,
        pageSize,
        total: totalItems,
        pages: totalPages,
      },
    };
  }

  ///test

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.userModal.findOne({ email });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModal.updateOne(
      {
        _id: updateUserDto._id,
      },
      { ...updateUserDto },
    );
  }

  async remove(_id: string) {
    // check id
    if (mongoose.isValidObjectId(_id)) {
      //delete
      return this.userModal.deleteOne({ _id });
    } else {
      throw new BadRequestException(' Id khong dung dung dinh dang mongodb');
    }
    return `This action removes a #${_id} user`;
  }

  handleRegister = async (registerDto: CreateAuthDto) => {
    const { name, email, password } = registerDto;

    // check email
    const isExist = await this.isEmailExist(email);

    if (isExist) {
      throw new BadRequestException(
        `Email ${email} đã tồn tại. vui lòng nhập email khác !`,
      );
    }

    // Hash the password asynchronously and await the result
    const hashedPassword = await hashPasswordHelper(password); // Await the hashed password
    const codeId = uuidv4();
    // Create the user with the hashed password
    const user = await this.userModal.create({
      name,
      email,
      password: hashedPassword, // Use the resolved hashed password
      isActive: false,
      codeId: codeId,
      // codeExpired: dayjs().add(5, 'minutes'),
      codeExpired: dayjs().add(5, 'minutes'),
    });

    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Activate your account at @JWT', // Subject line
      text: 'welcome', // plaintext body
      template: 'register.hbs',
      context: {
        name: user?.name ?? user.name,
        activationCode: user.codeId,
      },
    });

    //Phản hồi

    return {
      _id: user.id,
    };

    // send Email
  };

  handleActive = async (data: CodeAuthDto) => {
    const user = await this.userModal.findOne({
      _id: data._id,
      codeId: data.code,
    });

    if (!user) {
      throw new BadRequestException('Mã code không hợp lệ !');
    }

    //check expire

    const isBeforeCheck = dayjs().isBefore(user.codeExpired);
    if (isBeforeCheck) {
      //update user
      await this.userModal.updateOne({ _id: data._id }, { isActive: true });

      return { isBeforeCheck };
    } else {
      throw new BadRequestException('Mã code không hợp lệ !');
    }
  };
  RetryAcitve = async (email: string) => {
    const user = await this.userModal.findOne({ email });
    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại !');
    }
    if (user.isActive) {
      throw new BadRequestException('Tài khoản đã được kích hoạt !');
    }

    //update user
    const codeId = uuidv4();

    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes'),
    });

    const updatedUser = await this.userModal.findOne({ _id: user._id });

    this.mailerService.sendMail({
      to: updatedUser.email, // Đảm bảo gửi email cho updatedUser
      subject: 'Activate your account at @JWT',
      text: `Hello ${updatedUser.name}, please activate your account using the code: ${updatedUser.codeId}`,
      template: 'register.hbs',
      context: {
        name: updatedUser.name || 'User',
        activationCode: updatedUser.codeId,
      },
    });

    return { _id: user._id };
  };

  RetryPassword = async (email: string) => {
    const user = await this.userModal.findOne({ email });
    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại !');
    }

    //update user
    const codeId = uuidv4();

    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes'),
    });

    const updatedUser = await this.userModal.findOne({ _id: user._id });

    this.mailerService.sendMail({
      to: updatedUser.email, // Đảm bảo gửi email cho updatedUser
      subject: 'change your password account at @JWT',
      text: `Hello ${updatedUser.name}, please activate your account using the code: ${updatedUser.codeId}`,
      template: 'register.hbs',
      context: {
        name: updatedUser.name || 'User',
        activationCode: updatedUser.codeId,
      },
    });

    return { _id: user._id, email: user.email };
  };

  changePassword = async (data: ChangePasswordAuthDto) => {
    if (data.confirmPassword !== data.password) {
      throw new BadRequestException(
        'Mật khẩu và xác nhận mật khẩu không trùng khớp',
      );
    }
    //check email
    const user = await this.userModal.findOne({ email: data.email });
    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại !');
    }

    //check expire

    const isBeforeCheck = dayjs().isBefore(user.codeExpired);
    if (isBeforeCheck) {
      //update password
      const newPassword = await hashPasswordHelper(data.password);
      await user.updateOne({ password: newPassword });

      return { isBeforeCheck };
    } else {
      throw new BadRequestException('Mã code không hợp lệ !');
    }
  };
}
