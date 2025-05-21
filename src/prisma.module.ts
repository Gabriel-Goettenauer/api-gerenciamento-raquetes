// src/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service'; // Assumindo que prisma.service.ts está na mesma pasta

@Global() // <<<< IMPORTANTE: Torna o PrismaService globalmente disponível.
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporta o PrismaService para que outros módulos possam injetá-lo
})
export class PrismaModule {}