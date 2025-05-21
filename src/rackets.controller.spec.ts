// src/rackets.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { HttpAdapterHost } from '@nestjs/core';

// Definimos um mock para o PrismaService
const mockPrismaService = {
  racket: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

describe('RacketsController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(PrismaService)
    .useValue(mockPrismaService)
    .compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('v1');

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);

    await prismaService.$connect();
    await (prismaService.racket.deleteMany as jest.Mock).mockResolvedValue(true);
    await prismaService.racket.deleteMany();
  });

  afterAll(async () => {
    await (prismaService.racket.deleteMany as jest.Mock).mockResolvedValue(true);
    await prismaService.racket.deleteMany();
    await prismaService.$disconnect();
    await app.close();
  });

  describe('/v1/rackets (POST)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new racket', async () => {
      const createRacketDto = {
        name: 'Raquete Integracao',
        brand: 'Adidas',
        weight: 360,
      };
      (prismaService.racket.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...createRacketDto
      });
      return request(app.getHttpServer())
        .post('/v1/rackets')
        .send(createRacketDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createRacketDto.name);
        });
    });

    it('should return 400 for invalid input', () => {
      return request(app.getHttpServer())
        .post('/v1/rackets')
        // >>>>> ESTA LINHA FOI ALTERADA (name: 'Sh') <<<<<
        .send({ name: 'Sh', brand: '', weight: 'not-a-number' }) // Mude 'Short' para 'Sh' (menos de 5 caracteres)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(expect.arrayContaining([
            // >>>>> ESTA MENSAGEM FOI ATUALIZADA <<<<<
            'O nome da raquete deve ter no mínimo 5 caracteres.', // Nova mensagem em português
            'A marca da raquete não pode ser vazia.',
            'O peso da raquete deve ser um número.',
            'O peso da raquete deve ser um valor positivo.',
          ]));
        });
    });

    it('should return 409 if racket name already exists', async () => {
        const createRacketDto = {
          name: 'Existing Racket Name',
          brand: 'Brand X',
          weight: 330,
        };
        (prismaService.racket.create as jest.Mock).mockRejectedValue({
            code: 'P2002',
            meta: { target: ['name'] },
            message: 'Unique constraint failed on the fields: (`name`)',
        });
        return request(app.getHttpServer())
          .post('/v1/rackets')
          .send(createRacketDto)
          .expect(409)
          .expect((res) => {
            expect(res.body.message).toContain('Já existe uma raquete com este nome.');
          });
      });
  });

  describe('/v1/rackets (GET)', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      (prismaService.racket.findMany as jest.Mock).mockResolvedValue([
        { id: 1, name: 'Racket Get 1', brand: 'Brand G1', weight: 300 },
        { id: 2, name: 'Racket Get 2', brand: 'Brand G2', weight: 310 },
      ]);
    });
    it('should return all rackets', () => {
      return request(app.getHttpServer())
        .get('/v1/rackets')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
          expect(res.body[0].name).toBe('Racket Get 1');
          expect(res.body[1].name).toBe('Racket Get 2');
        });
    });
  });

  describe('/v1/rackets/:id (GET)', () => {
    const testRacketId = 123;
    const testRacket = { id: testRacketId, name: 'Racket Find One', brand: 'Brand FO', weight: 320 };
    beforeEach(() => {
      jest.clearAllMocks();
      (prismaService.racket.findUnique as jest.Mock).mockImplementation((args) => {
        if (args.where.id === testRacketId) {
          return Promise.resolve(testRacket);
        }
        return Promise.resolve(null);
      });
    });
    it('should return a racket by ID', () => {
      return request(app.getHttpServer())
        .get(`/v1/rackets/${testRacketId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(testRacketId);
          expect(res.body.name).toBe(testRacket.name);
        });
    });
    it('should return 404 if racket is not found', () => {
        const nonExistentId = 999999;
        return request(app.getHttpServer())
        .get(`/v1/rackets/${nonExistentId}`)
        .expect(404)
        .expect((res) => {
            expect(res.body.message).toBe(`Raquete com ID ${nonExistentId} não encontrada.`);
        });
    });
  });

  describe('/v1/rackets/:id (PUT)', () => {
    const testRacketId = 456;
    const originalRacket = { id: testRacketId, name: 'Original Name', brand: 'Original Brand', weight: 300 };
    beforeEach(() => {
      jest.clearAllMocks();
      (prismaService.racket.findUnique as jest.Mock).mockImplementation((args) => {
        if (args.where.id === testRacketId) {
          return Promise.resolve(originalRacket);
        }
        return Promise.resolve(null);
      });
      (prismaService.racket.update as jest.Mock).mockImplementation((args) => {
        if (args.where.id === testRacketId) {
          return Promise.resolve({ ...originalRacket, ...args.data });
        }
        return Promise.reject(new Error('Racket not found for update mock'));
      });
    });
    it('should update a racket by ID', () => {
      const updateDto = { name: 'Updated Racket Name', weight: 350 };
      return request(app.getHttpServer())
        .put(`/v1/rackets/${testRacketId}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(testRacketId);
          expect(res.body.name).toBe(updateDto.name);
          expect(res.body.weight).toBe(updateDto.weight);
        });
    });
    it('should return 404 if racket to update is not found', () => {
      const nonExistentId = 999999;
      (prismaService.racket.findUnique as jest.Mock).mockResolvedValueOnce(null);
      return request(app.getHttpServer())
        .put(`/v1/rackets/${nonExistentId}`)
        .send({ name: 'Non Existent Update' })
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe(`Raquete com ID ${nonExistentId} não encontrada.`);
        });
    });
    it('should return 400 for invalid update input', () => {
        return request(app.getHttpServer())
          .put(`/v1/rackets/${testRacketId}`)
          // >>>>> ESTA LINHA FOI ALTERADA (name: 'Sh') <<<<<
          .send({ name: 'Sh', weight: 'not-a-number' }) // Mude 'Short' para 'Sh'
          .expect(400)
          .expect((res) => {
            // >>>>> ESTA MENSAGEM FOI ATUALIZADA <<<<<
            expect(res.body.message).toEqual(expect.arrayContaining([
              'O nome da raquete deve ter no mínimo 5 caracteres.', // Nova mensagem em português
              'O peso da raquete deve ser um número.',
              'O peso da raquete deve ser um valor positivo.',
            ]));
          });
      });
  });

  describe('/v1/rackets/:id (DELETE)', () => {
    const testRacketId = 789;
    const racketToDelete = { id: testRacketId, name: 'Racket to Delete', brand: 'Brand Del', weight: 350 };
    beforeEach(() => {
      jest.clearAllMocks();
      (prismaService.racket.findUnique as jest.Mock).mockImplementation((args) => {
        if (args.where.id === testRacketId) {
          return Promise.resolve(racketToDelete);
        }
        return Promise.resolve(null);
      });
      (prismaService.racket.delete as jest.Mock).mockResolvedValue(racketToDelete);
    });
    it('should delete a racket by ID', async () => {
      await request(app.getHttpServer())
        .delete(`/v1/rackets/${testRacketId}`)
        .expect(204);
      (prismaService.racket.findUnique as jest.Mock).mockResolvedValueOnce(null);
      const foundRacket = await prismaService.racket.findUnique({
        where: { id: testRacketId },
      });
      expect(foundRacket).toBeNull();
    });
    it('should return 404 if racket to delete is not found', () => {
      const nonExistentId = 999999;
      (prismaService.racket.findUnique as jest.Mock).mockResolvedValueOnce(null);
      (prismaService.racket.delete as jest.Mock).mockRejectedValue(new Error('Racket not found for delete mock'));
      return request(app.getHttpServer())
        .delete(`/v1/rackets/${nonExistentId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe(`Raquete com ID ${nonExistentId} não encontrada.`);
        });
    });
  });
});