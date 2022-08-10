import { MaxLength } from 'class-validator';

export class UpdateTreeDto {
  @MaxLength(50)
  name: string;
}
