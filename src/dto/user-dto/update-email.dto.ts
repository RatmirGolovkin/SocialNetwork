import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmailDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly newEmail: string;
}
