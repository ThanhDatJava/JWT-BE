import { PartialType } from '@nestjs/mapped-types';
import { CreateRewardDto } from './create-reward.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateRewardDto extends PartialType(CreateRewardDto) {}

export class UpdateDrinkDto {
  @IsMongoId({ message: '_id không hợp lệ' })
  @IsNotEmpty({ message: '_id không được để trống' })
  _id: string;

  @IsOptional()
  prizes: string;
  @IsOptional()
  colors: string;
}
