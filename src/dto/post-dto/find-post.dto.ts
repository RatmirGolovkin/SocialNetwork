import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class FindPostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  readonly name: string;
}
