import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Home } from './schemas/home.schemas';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(Home.name)
    private HomeModal: Model<Home>,
  ) {}

  create(createHomeDto: CreateHomeDto) {
    return 'This action adds a new home';
  }

  findAll() {
    return `This action returns all home`;
  }

  findOne(id: number) {
    return `This action returns a #${id} home`;
  }

  update(id: number, updateHomeDto: UpdateHomeDto) {
    return `This action updates a #${id} home`;
  }

  async remove(_id: string) {
    // check id

    if (mongoose.isValidObjectId(_id)) {
      //delete
      return this.HomeModal.deleteOne({ _id });
    } else {
      throw new BadRequestException(' Id khong dung dung dinh dang mongodb');
    }
  }

  async getListDetailHomepage() {
    const listDetailHomepage = await this.HomeModal.find();
    return listDetailHomepage;
  }

  async createDetailHomepage(createHomeDto: CreateHomeDto) {
    const { image, title, description } = createHomeDto;

    try {
      // Kiểm tra nếu image là chuỗi base64 hợp lệ
      if (!image || !image.startsWith('data:image')) {
        throw new Error('Invalid base64 image data.');
      }

      // Tạo món detail home page trong cơ sở dữ liệu
      const detailHomepage = await this.HomeModal.create({
        image, // Lưu trực tiếp chuỗi base64
        title,
        description,
      });

      return { detailHomepage }; // Trả về thông tin đã lưu
    } catch (error) {
      console.error('Error in createDetailHomepage:', error);
      throw new Error(
        'An error occurred while processing the homepage detail.',
      );
    }
  }

  async editDetailHomepage(updateHomeDto: UpdateHomeDto) {
    return await this.HomeModal.updateOne(
      {
        _id: updateHomeDto._id,
      },
      { ...updateHomeDto },
    );
  }

  async deleteDetailHomepage(updateHomeDto: UpdateHomeDto) {
    const { _id } = updateHomeDto;
    // Check if the provided ID is valid
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('Invalid or empty ID format');
    }

    const data = await this.HomeModal.findOne({ _id });

    if (data) {
      // Delete the document and return the result (or just the deleted data)
      await this.HomeModal.deleteOne({ _id });
      return { message: 'Document successfully deleted' };
    } else {
      throw new BadRequestException('Id không tồn tại');
    }
  }
}
