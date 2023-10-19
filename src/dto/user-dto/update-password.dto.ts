import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;

  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;
}
