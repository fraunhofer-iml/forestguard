import { AmqpException } from '@forrest-guard/amqp';
import { PrismaService } from '@forrest-guard/database';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyMapper } from './company.mapper';
import { CompanyService } from './company.service';
import { COMPANY_PRISMA_MOCK } from './mocked-data/company.mock';

describe('CompanyService', () => {
  let service: CompanyService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: PrismaService,
          useValue: {
            company: {
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a valid CompanyDto', async () => {
    const givenCompanyId = COMPANY_PRISMA_MOCK.id;
    const expectedCompanyDto = CompanyMapper.mapCompanyPrismaToCompanyDto(COMPANY_PRISMA_MOCK);

    jest.spyOn(prisma.company, 'findFirst').mockResolvedValue(COMPANY_PRISMA_MOCK);
    const actualCompanyDto = await service.readCompanyById(givenCompanyId);

    expect(actualCompanyDto).toEqual(expectedCompanyDto);

    expect(prisma.company.findFirst).toHaveBeenCalledWith({
      include: {
        address: true,
        users: {
          include: {
            address: true,
            plotsOfLand: {
              include: {
                cultivatedWith: true,
                proofs: true,
              },
            },
          },
        },
      },
    });
  });

  it('should throw a AmqpException', async () => {
    const givenCompanyId = '123';
    const expectedException = AmqpException;

    jest.spyOn(prisma.company, 'findFirst').mockResolvedValue(null);

    await expect(service.readCompanyById(givenCompanyId)).rejects.toThrow(expectedException);
  });
});
