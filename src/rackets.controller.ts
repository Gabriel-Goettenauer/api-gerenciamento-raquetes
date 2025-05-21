import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RacketsService, Racket } from './rackets.service';
import { CreateRacketDto } from './create-racket.dto';
import { UpdateRacketDto } from './update-racket.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RacketResponseDto } from './racket-response.dto';

const RacketExample: RacketResponseDto = {
  id: 1,
  name: 'Head Zephyr Pro',
  brand: 'Head',
  weight: 335,
  createdAt: new Date('2023-01-15T10:00:00.000Z'),
  updatedAt: new Date('2023-01-15T10:00:00.000Z'),
};

const ErrorExample = {
  statusCode: 400,
  message: ["O nome da raquete deve ter no mínimo 5 caracteres."],
  error: "Bad Request"
}

const ConflictErrorExample = {
  statusCode: 409,
  message: "Já existe uma raquete com este nome.",
  error: "Conflict"
}


@ApiTags('rackets')
@Controller('rackets')
export class RacketsController {
  constructor(private readonly racketsService: RacketsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova raquete de beach tennis' })
  @ApiResponse({
    status: 201,
    description: 'Raquete criada com sucesso.',
    type: RacketResponseDto,
    schema: { example: RacketExample },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos.',
    schema: { example: ErrorExample },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito: Já existe uma raquete com este nome.',
    schema: { example: ConflictErrorExample },
  })
  @ApiBody({ type: CreateRacketDto, description: 'Dados da raquete a ser criada' })
  async create(@Body() createRacketDto: CreateRacketDto): Promise<Racket> {
    return this.racketsService.create(createRacketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as raquetes de beach tennis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de raquetes retornada com sucesso.',
    type: [RacketResponseDto],
    schema: { example: [RacketExample] },
  })
  async findAll(): Promise<Racket[]> {
    return this.racketsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma raquete de beach tennis por ID' })
  @ApiResponse({
    status: 200,
    description: 'Raquete encontrada.',
    type: RacketResponseDto,
    schema: { example: RacketExample },
  })
  @ApiResponse({
    status: 404,
    description: 'Raquete não encontrada.',
    schema: {
      example: {
        statusCode: 404,
        message: "Raquete com ID 123 não encontrada.",
        error: "Not Found"
      }
    }
  })
  async findOne(@Param('id') id: string): Promise<Racket> {
    return this.racketsService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma raquete de beach tennis existente' })
  @ApiResponse({
    status: 200,
    description: 'Raquete atualizada com sucesso.',
    type: RacketResponseDto,
    schema: { example: RacketExample },
  })
  @ApiResponse({
    status: 404,
    description: 'Raquete não encontrada.',
    schema: {
      example: {
        statusCode: 404,
        message: "Raquete com ID 123 não encontrada.",
        error: "Not Found"
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos.',
    schema: { example: ErrorExample },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito: Já existe uma raquete com este nome.',
    schema: { example: ConflictErrorExample },
  })
  @ApiBody({ type: UpdateRacketDto, description: 'Dados da raquete para atualização' })
  async update(@Param('id') id: string, @Body() updateRacketDto: UpdateRacketDto): Promise<Racket> {
    return this.racketsService.update(+id, updateRacketDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove uma raquete de beach tennis' })
  @ApiResponse({ status: 204, description: 'Raquete removida com sucesso.' })
  @ApiResponse({
    status: 404,
    description: 'Raquete não encontrada.',
    schema: {
      example: {
        statusCode: 404,
        message: "Raquete com ID 123 não encontrada.",
        error: "Not Found"
      }
    }
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.racketsService.remove(+id);
  }
}