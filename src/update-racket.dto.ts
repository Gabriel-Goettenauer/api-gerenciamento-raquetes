import { PartialType } from '@nestjs/swagger'; 
import { CreateRacketDto } from './create-racket.dto'; 


export class UpdateRacketDto extends PartialType(CreateRacketDto) {}