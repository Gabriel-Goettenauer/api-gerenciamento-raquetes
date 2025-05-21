import { Test, TestingModule } from '@nestjs/testing';
import { RacketsService } from './rackets.service'; 
import { PrismaService } from './prisma.service'; 

describe('RacketsService', () => {
  let service: RacketsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    racket: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RacketsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RacketsService>(RacketsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a racket', async () => {
      const createRacketDto = {
        name: 'Racket Test',
        brand: 'Brand Test',
        weight: 350,
      };
      const expectedRacket = { id: 1, ...createRacketDto, createdAt: new Date(), updatedAt: new Date() };

      (prisma.racket.create as jest.Mock).mockResolvedValue(expectedRacket);

      const result = await service.create(createRacketDto);
      expect(result).toEqual(expectedRacket);
      expect(prisma.racket.create).toHaveBeenCalledWith({ data: createRacketDto });
    });

    it('should throw an error if racket name already exists (P2002)', async () => {
      const createRacketDto = {
        name: 'Existing Racket',
        brand: 'Brand Test',
        weight: 350,
      };
      const prismaError = { code: 'P2002' };

      (prisma.racket.create as jest.Mock).mockRejectedValue(prismaError);

      await expect(service.create(createRacketDto)).rejects.toThrow('Já existe uma raquete com este nome.');
      expect(prisma.racket.create).toHaveBeenCalledWith({ data: createRacketDto });
    });
  });

  describe('findAll', () => {
    it('should return an array of rackets', async () => {
      const expectedRackets = [
        { id: 1, name: 'Racket 1', brand: 'Brand A', weight: 340, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Racket 2', brand: 'Brand B', weight: 350, createdAt: new Date(), updatedAt: new Date() },
      ];
      (prisma.racket.findMany as jest.Mock).mockResolvedValue(expectedRackets);

      const result = await service.findAll();
      expect(result).toEqual(expectedRackets);
      expect(prisma.racket.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single racket if found', async () => {
      const expectedRacket = { id: 1, name: 'Racket 1', brand: 'Brand A', weight: 340, createdAt: new Date(), updatedAt: new Date() };
      (prisma.racket.findUnique as jest.Mock).mockResolvedValue(expectedRacket);

      const result = await service.findOne(1);
      expect(result).toEqual(expectedRacket);
      expect(prisma.racket.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if racket not found', async () => {
      (prisma.racket.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('Raquete com ID 999 não encontrada.');
      expect(prisma.racket.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  describe('update', () => {
    it('should update a racket', async () => {
      const updateRacketDto = { name: 'Updated Racket', weight: 360 };
      const existingRacket = { id: 1, name: 'Old Racket', brand: 'Brand A', weight: 340, createdAt: new Date(), updatedAt: new Date() };
      const updatedRacket = { ...existingRacket, ...updateRacketDto };

      (prisma.racket.findUnique as jest.Mock).mockResolvedValue(existingRacket);
      (prisma.racket.update as jest.Mock).mockResolvedValue(updatedRacket);

      const result = await service.update(1, updateRacketDto);
      expect(result).toEqual(updatedRacket);
      expect(prisma.racket.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.racket.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateRacketDto,
      });
    });

    it('should throw NotFoundException if racket to update not found', async () => {
      (prisma.racket.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(999, { name: 'Non Existent' })).rejects.toThrow('Raquete com ID 999 não encontrada.');
      expect(prisma.racket.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(prisma.racket.update).not.toHaveBeenCalled();
    });

    it('should throw an error if updated racket name already exists (P2002)', async () => {
        const updateRacketDto = { name: 'Existing Racket', weight: 360 };
        const existingRacket = { id: 1, name: 'Old Racket', brand: 'Brand A', weight: 340, createdAt: new Date(), updatedAt: new Date() };
        const prismaError = { code: 'P2002' };
  
        (prisma.racket.findUnique as jest.Mock).mockResolvedValue(existingRacket);
        (prisma.racket.update as jest.Mock).mockRejectedValue(prismaError);
  
        await expect(service.update(1, updateRacketDto)).rejects.toThrow('Já existe uma raquete com este nome.');
        expect(prisma.racket.update).toHaveBeenCalledWith({
          where: { id: 1 },
          data: updateRacketDto,
        });
      });
  });

  describe('remove', () => {
    it('should remove a racket', async () => {
      const racketToRemove = { id: 1, name: 'Racket 1', brand: 'Brand A', weight: 340, createdAt: new Date(), updatedAt: new Date() };
      (prisma.racket.findUnique as jest.Mock).mockResolvedValue(racketToRemove);
      (prisma.racket.delete as jest.Mock).mockResolvedValue(racketToRemove);

      const result = await service.remove(1);
      expect(result).toEqual(racketToRemove);
      expect(prisma.racket.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.racket.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if racket to remove not found', async () => {
      (prisma.racket.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow('Raquete com ID 999 não encontrada.');
      expect(prisma.racket.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(prisma.racket.delete).not.toHaveBeenCalled();
    });
  });
});