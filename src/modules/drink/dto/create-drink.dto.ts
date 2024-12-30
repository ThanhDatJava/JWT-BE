import { IsNotEmpty } from 'class-validator';

export class CreateDrinkDto {
  @IsNotEmpty({ message: 'name must not be left blank' })
  name: string;
  @IsNotEmpty({ message: 'drink must not be left blank' })
  drink: string;
  @IsNotEmpty({ message: 'description must not be left blank' })
  description: string;
  @IsNotEmpty({ message: 'descriptionMore must not be left blank' })
  descriptionMore: string;
  @IsNotEmpty({ message: 'price must not be left blank' })
  price: string;
  @IsNotEmpty({ message: 'image must not be left blank' })
  image: string;
}
