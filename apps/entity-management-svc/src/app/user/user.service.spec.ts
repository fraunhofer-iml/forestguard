import { PrismaService } from '@forest-guard/database';
import { Test, TestingModule } from '@nestjs/testing';
import { FARMER_PRISMA_MOCK } from './mocked-data/farmer.mock';
import { USER_PRISMA_MOCK } from './mocked-data/user.mock';
import * as Mapper from './user.mapper';
import * as Queries from './user.queries';
import { farmerReadByCompanyId } from './user.queries';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an user', async () => {
    const givenUserDto = {
      firstName: 'Test firstName',
      lastName: 'Test lastName',
    };

    jest.spyOn(prisma.user, 'create').mockResolvedValue(USER_PRISMA_MOCK);

    const response = await service.createUser(givenUserDto);

    expect(response).toEqual(Mapper.toUserDto(USER_PRISMA_MOCK));
    expect(prisma.user.create).toHaveBeenCalledWith(Queries.userCreate(givenUserDto));
  });

  it('should read users', async () => {
    jest.spyOn(prisma.user, 'findMany').mockResolvedValue([USER_PRISMA_MOCK, FARMER_PRISMA_MOCK]);

    const response = await service.readUsers();

    expect(response).toEqual([USER_PRISMA_MOCK, FARMER_PRISMA_MOCK].map(Mapper.toUserDto));
    expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
  });

  it('should read user by ID', async () => {
    const givenUserId = 'Test User ID';
    jest.spyOn(prisma.user, 'findUniqueOrThrow').mockResolvedValue(USER_PRISMA_MOCK);

    const response = await service.readUserById(givenUserId);

    expect(response).toEqual(Mapper.toUserOrFarmerDto({ ...USER_PRISMA_MOCK, address: undefined }));
    expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith(Queries.userOrFarmerReadById(givenUserId));
  });

  it('should create a farmer', async () => {
    const givenFarmerDto = {
      firstName: 'Test firstName',
      lastName: 'Test lastName',
      personalId: 'Test personalId',
      address: {
        street: 'Example Street',
        postalCode: '12345',
        city: 'Example City',
        state: 'Example State',
        country: 'Example Country',
      },
    };

    jest.spyOn(prisma.user, 'create').mockResolvedValue(FARMER_PRISMA_MOCK);

    const response = await service.createFarmer(givenFarmerDto);

    expect(response).toEqual(Mapper.toUserOrFarmerDto(FARMER_PRISMA_MOCK));
    expect(prisma.user.create).toHaveBeenCalledWith(Queries.farmerCreate(givenFarmerDto));
  });

  it('should read farmer by company ID', async () => {
    const givenCompanyId = 'Test Company ID';
    jest.spyOn(prisma.user, 'findMany').mockResolvedValue([FARMER_PRISMA_MOCK]);

    const response = await service.readFarmersByCompanyId(givenCompanyId);

    expect(response).toEqual([FARMER_PRISMA_MOCK].map(Mapper.toUserOrFarmerDto));
    expect(prisma.user.findMany).toHaveBeenCalledWith(farmerReadByCompanyId(givenCompanyId));
  });
});
