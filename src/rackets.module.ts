// src/rackets.module.ts
import { Module } from '@nestjs/common';
import { RacketsController } from './rackets.controller';
import { RacketsService } from './rackets.service';

@Module({
  imports: [], // <<<< Remova o AppModule daqui. Não é mais necessário.
  controllers: [RacketsController],
  providers: [RacketsService],
  exports: [RacketsService],
})
export class RacketsModule {}