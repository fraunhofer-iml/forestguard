import { ProofCreateDto, ProofType } from '@forrest-guard/api-interfaces';
import { PrismaService } from '@forrest-guard/database';
import { FileStorageService } from '@forrest-guard/file-storage';
import { Test, TestingModule } from '@nestjs/testing';
import { PROOF_PRISMA_MOCK } from './mocked-data/proof.mock';
import { ProofService } from './proof.service';

describe('ProofService', () => {
  const FILE_STORAGE_URL = 'http://dummy-file-storage:1337/my-bucket-name';

  let proofService: ProofService;
  let prismaService: PrismaService;
  let fileStorageService: FileStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        ProofService,
        {
          provide: PrismaService,
          useValue: {
            proof: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: FileStorageService,
          useValue: {
            uploadFile: jest.fn(),
            fileStorageUrl: FILE_STORAGE_URL,
          },
        },
      ],
    }).compile();

    proofService = module.get<ProofService>(ProofService);
    prismaService = module.get<PrismaService>(PrismaService);
    fileStorageService = module.get<FileStorageService>(FileStorageService);
  });

  it('should be defined', () => {
    expect(proofService).toBeDefined();
    expect(prismaService).toBeDefined();
    expect(fileStorageService).toBeDefined();
  });

  it('should create a proof', async () => {
    const givenPlotOfLandId = '1';
    const givenDto: ProofCreateDto = {
      type: ProofType.PROOF_OF_FREEDOM,
      documentRef: '',
      notice: '',
    };
    const givenFile: Express.Multer.File = {
      originalname: '1-1-1-1-1.pdf',
      buffer: Buffer.of(1),
      fieldname: '',
      encoding: '',
      mimetype: '',
      size: 0,
      stream: null,
      destination: '',
      filename: '',
      path: '',
    };
    const expectedResult = PROOF_PRISMA_MOCK;

    jest.spyOn(fileStorageService, 'uploadFile').mockResolvedValue(null);
    jest.spyOn(prismaService.proof, 'create').mockResolvedValue(expectedResult);
    jest.spyOn(crypto, 'randomUUID').mockReturnValue('1-1-1-1-1');

    const actualResult = await proofService.createProof(givenPlotOfLandId, givenDto, givenFile);

    expect(fileStorageService.uploadFile).toHaveBeenCalledWith(givenFile.originalname, Buffer.from(givenFile.buffer));

    expect(prismaService.proof.create).toHaveBeenCalledWith({
      data: {
        type: givenDto.type,
        documentRef: givenFile.originalname,
        notice: null,
        plotOfLand: {
          connect: {
            id: givenPlotOfLandId,
          },
        },
      },
    });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should read proofs by plotOfLandId', async () => {
    const givenPlotOfLandId = '1';
    const expectedResult = [PROOF_PRISMA_MOCK];

    jest.spyOn(prismaService.proof, 'findMany').mockResolvedValue(expectedResult);

    const actualResult = await proofService.readProofsByPlotOfLandId(givenPlotOfLandId);

    expect(prismaService.proof.findMany).toHaveBeenCalledWith({
      where: {
        plotOfLandId: givenPlotOfLandId,
      },
    });

    expect(actualResult).toEqual(
      expectedResult.map((proof) => ({
        ...proof,
        documentRef: `${FILE_STORAGE_URL}/${proof.documentRef}`,
      }))
    );
  });
});
