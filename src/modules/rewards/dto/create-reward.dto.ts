import { IsNotEmpty } from 'class-validator';

export class CreateRewardDto {
  @IsNotEmpty({ message: 'prizes must not be left blank' })
  prizes: string;
  @IsNotEmpty({ message: 'colors must not be left blank' })
  colors: string;
}
