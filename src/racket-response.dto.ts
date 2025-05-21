// src/racket-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class RacketResponseDto {
  @ApiProperty({ description: 'ID da raquete', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome da raquete', example: 'Head Zephyr Pro' })
  name: string;

  @ApiProperty({ description: 'Marca da raquete', example: 'Head' })
  brand: string;

  @ApiProperty({ description: 'Peso da raquete em gramas', example: 335 })
  weight: number;

  @ApiProperty({ description: 'Data de criação do registro', example: '2023-01-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização do registro', example: '2023-01-15T10:00:00.000Z' })
  updatedAt: Date;
}