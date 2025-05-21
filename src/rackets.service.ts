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
  constructor(private prisma: PrismaService, private configService: ConfigService) {
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