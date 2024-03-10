import { IsInt, IsString } from 'class-validator';

export class CreateTicketDTO {
  @IsInt()
  userId: number;

  @IsString()
  userName: string;

  @IsString()
  userEmail: string;

  @IsString()
  textmessage: string;
}
