import { PartialType } from '@nestjs/mapped-types';
import { CreateHomeDto } from './create-home.dto';
import { IsMongoId, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class UpdateHomeDto extends PartialType(CreateHomeDto) {
  @IsMongoId({ message: '_id không hợp lệ' })
  @IsNotEmpty({ message: '_id không được để trống' })
  _id: string;

  @IsOptional()
  @Matches(/^data:image\/(png|jpeg|jpg|gif);base64,/, {
    message: 'Invalid Base64 image format',
  })
  image: string;

  @IsOptional()
  title: string;

  @IsOptional()
  description: string;
}
