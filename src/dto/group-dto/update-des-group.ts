import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateDescriptionGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  readonly description: string;
}
