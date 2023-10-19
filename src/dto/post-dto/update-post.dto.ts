import { IsString, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @MaxLength(12)
  readonly name: string;

  @IsString()
  @MaxLength(200)
  readonly text: string;
}
