
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'usuario@example.com', description: 'Email do usuário' })
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido.' })
  email: string;

  @ApiProperty({ example: 'SenhaSegura123', description: 'Senha do usuário (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password: string;
}