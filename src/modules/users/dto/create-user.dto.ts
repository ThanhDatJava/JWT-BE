import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'name must not be left blank' })
  name: string;
  @IsNotEmpty({ message: 'email must not be left blank' })
  @IsEmail({}, { message: 'Incorrectly formatted email' })
  email: string;
  @IsNotEmpty({ message: 'password must not be left blank' })
  password: string;
  phone: string;
  address: string;
  image: string;
}
