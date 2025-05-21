// src/rackets.service.ts
import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateRacketDto } from './create-racket.dto';
import { UpdateRacketDto } from './update-racket.dto';
import { PrismaService } from './prisma.service';
import { Racket as PrismaRacket } from '@prisma/client';
import { ConfigService } from '@nestjs/config'; // <<<< IMPORTAR ConfigService

export type Racket = PrismaRacket;

@Injectable()
export class RacketsService {
  // <<<< CONSTRUTOR ALTERADO PARA INJETAR ConfigService
  constructor(private prisma: PrismaService, private configService: ConfigService) {
    // Exemplo de como acessar uma variável de ambiente.
    // Para testar, você pode adicionar uma variável no seu arquivo .env, por exemplo:
    // API_DESCRIPTION="Minha API de Raquetes"
    // E descomentar a linha abaixo para ver no console.
    // console.log('API Description from .env:', this.configService.get<string>('API_DESCRIPTION'));

    // Outros exemplos de acesso a variáveis de ambiente já existentes:
    // console.log('Database URL:', this.configService.get<string>('DATABASE_URL'));
    // console.log('Node Env:', this.configService.get<string>('NODE_ENV'));
  }

  async create(createRacketDto: CreateRacketDto): Promise<Racket> {
    try {
      return await this.prisma.racket.create({
        data: createRacketDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Já existe uma raquete com este nome.');
      }
      throw new InternalServerErrorException('Erro inesperado ao criar raquete.');
    }
  }

  async findAll(): Promise<Racket[]> {
    return this.prisma.racket.findMany();
  }

  async findOne(id: number): Promise<Racket> {
    const racket = await this.prisma.racket.findUnique({
      where: { id },
    });
    if (!racket) {
      throw new NotFoundException(`Raquete com ID ${id} não encontrada.`);
    }
    return racket;
  }

  async update(id: number, updateRacketDto: UpdateRacketDto): Promise<Racket> {
    const existingRacket = await this.findOne(id);

    try {
      return await this.prisma.racket.update({
        where: { id: existingRacket.id },
        data: updateRacketDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Já existe uma raquete com este nome.');
      }
      throw new InternalServerErrorException('Erro inesperado ao atualizar raquete.');
    }
  }

  async remove(id: number): Promise<Racket> {
    const existingRacket = await this.findOne(id);

    return await this.prisma.racket.delete({
      where: { id: existingRacket.id },
    });
  }
}