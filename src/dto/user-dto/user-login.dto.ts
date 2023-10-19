import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @MaxLength(15)
  @IsNotEmpty()
  readonly login: string;

  @IsString()
  @IsEmail()
  @MaxLength(100)
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  public password: string;
}
