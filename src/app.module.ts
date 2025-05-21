// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RacketsModule } from './rackets.module';
import { PrismaModule } from './prisma.module'; // <<<< Adicione esta importação
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    PrismaModule, // <<<< Importe o PrismaModule aqui. Como ele é @Global(), já estará disponível.
    RacketsModule, // Importa o RacketsModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  // NÃO PRECISA MAIS EXPORTAR O PrismaService AQUI, pois o PrismaModule já o exporta globalmente
  // exports: [PrismaService], // REMOVA esta linha
})
export class AppModule {}