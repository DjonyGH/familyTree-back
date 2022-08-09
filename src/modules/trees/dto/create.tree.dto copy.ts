import { MaxLength } from 'class-validator';

export class CreateTreeDto {
  @MaxLength(50)
  name: string;
}
