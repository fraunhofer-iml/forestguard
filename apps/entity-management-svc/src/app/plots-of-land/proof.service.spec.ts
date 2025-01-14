/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProofCreateDto, ProofType } from '@forest-guard/api-interfaces';
import { BlockchainConnectorService } from '@forest-guard/blockchain-connector';
import { PrismaService } from '@forest-guard/database';
import { FileStorageService } from '@forest-guard/file-storage';
import { Test, TestingModule } from '@nestjs/testing';
import { PROOF_PRISMA_MOCK } from './mocked-data/proof.mock';
import { ProofService } from './proof.service';

describe('ProofService', () => {
  let proofService: ProofService;
  let prismaService: PrismaService;
  let fileStorageService: FileStorageService;
  let blockchainConnectorService: BlockchainConnectorService;

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
              count: jest.fn(),
            },
          },
        },
        {
          provide: FileStorageService,
          useValue: {
            uploadFileWithDeepPath: jest.fn(),
          },
        },
        {
          provide: BlockchainConnectorService,
          useValue: {
            updatePlotOfLandNft: jest.fn(),
          },
        },
      ],
    }).compile();

    proofService = module.get<ProofService>(ProofService);
    prismaService = module.get<PrismaService>(PrismaService);
    fileStorageService = module.get<FileStorageService>(FileStorageService);
    blockchainConnectorService = module.get<BlockchainConnectorService>(BlockchainConnectorService);
  });

  it('should be defined', () => {
    expect(proofService).toBeDefined();
    expect(prismaService).toBeDefined();
    expect(fileStorageService).toBeDefined();
    expect(blockchainConnectorService).toBeDefined();
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

    jest.spyOn(fileStorageService, 'uploadFileWithDeepPath').mockResolvedValue(givenFile.originalname);
    jest.spyOn(prismaService.proof, 'create').mockResolvedValue(expectedResult);
    jest.spyOn(prismaService.proof, 'count').mockResolvedValue(0);

    const actualResult = await proofService.createProof(givenPlotOfLandId, givenDto, givenFile);

    expect(fileStorageService.uploadFileWithDeepPath).toHaveBeenCalledWith(givenFile, 'plot-of-land', givenPlotOfLandId);

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
      include: {
        plotOfLand: true,
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

    expect(actualResult).toEqual(expectedResult);
  });
});
