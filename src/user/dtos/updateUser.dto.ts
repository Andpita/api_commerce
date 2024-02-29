// Nome, Sobrenome, E-mail, CPF, Phone, Password;

import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  cpf: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;
}
