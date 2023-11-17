import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  readonly description: string;
}
