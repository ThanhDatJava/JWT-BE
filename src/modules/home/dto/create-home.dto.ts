import { IsString, Matches } from 'class-validator';

export class CreateHomeDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @Matches(/^data:image\/(png|jpeg|jpg|gif);base64,/, {
    message: 'Invalid Base64 image format',
  })
  image: string;
}
