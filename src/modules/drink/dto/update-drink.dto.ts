import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateDrinkDto {
  @IsMongoId({ message: '_id không hợp lệ' })
  @IsNotEmpty({ message: '_id không được để trống' })
  _id: string;

  @IsOptional()
  name: string;
  @IsOptional()
  drink: string;
  @IsOptional()
  description: string;
  @IsOptional()
  descriptionMore: string;
  @IsOptional()
  price: string;
  @IsOptional()
  image: string;
}
