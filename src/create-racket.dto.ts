
import { IsString, IsNumber, MinLength, IsNotEmpty, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 

export class CreateRacketDto {
  @ApiProperty({
    description: 'Nome da raquete de beach tennis (único)',
    minLength: 5,
    example: 'Head Zephyr Pro',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'O nome da raquete deve ter no mínimo 5 caracteres.' })
  name: string;

  @ApiProperty({
    description: 'Marca da raquete',
    example: 'Head',
  })
  @IsString()
  @IsNotEmpty({ message: 'A marca da raquete não pode ser vazia.' })
  brand: string;

  @ApiProperty({
    description: 'Peso da raquete em gramas (entre 250 e 400)',
    minimum: 250,
    maximum: 400,
    example: 335,
  })
  @IsNumber({}, { message: 'O peso da raquete deve ser um número.' })
  @Min(250, { message: 'O peso da raquete deve ser um valor positivo.' })
  @Max(400, { message: 'O peso da raquete não pode ser maior que 400 gramas.' })
  weight: number;
}