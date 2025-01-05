import { Injectable } from '@nestjs/common';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { Reward } from './schemas/reward.schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name)
    private RewardModal: Model<Reward>,
  ) {}

  create(createRewardDto: CreateRewardDto) {
    return 'This action adds a new reward';
  }

  findAll() {
    return `This action returns all rewards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reward`;
  }

  update(id: number, updateRewardDto: UpdateRewardDto) {
    return `This action updates a #${id} reward`;
  }

  remove(id: number) {
    return `This action removes a #${id} reward`;
  }

  async createDetailReward(createRewardDto: CreateRewardDto) {
    const { prizes, colors } = createRewardDto;

    try {
      // Tạo món detail home page trong cơ sở dữ liệu
      const detailRewardpage = await this.RewardModal.create({
        prizes,
        colors,
      });

      return { detailRewardpage }; // Trả về thông tin đã lưu
    } catch (error) {
      console.error('Error in createDetailReward:', error);
      throw new Error('An error occurred while processing the Reward detail.');
    }
  }

  async getListDetailReward() {
    const listDetailReward = await this.RewardModal.find();

    return listDetailReward;
  }
}
