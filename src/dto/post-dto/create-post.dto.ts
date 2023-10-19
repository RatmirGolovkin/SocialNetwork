import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  readonly name: string;

  @IsString()
  @MaxLength(200)
  readonly text: string;
}
