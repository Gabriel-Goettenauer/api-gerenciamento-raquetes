import { PartialType } from '@nestjs/swagger'; // Para o Swagger e tornar DTO opcional
import { CreateRacketDto } from './create-racket.dto'; // Importação direta do DTO base

// PartialType torna todas as propriedades de CreateRacketDto opcionais
export class UpdateRacketDto extends PartialType(CreateRacketDto) {}