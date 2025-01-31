/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AmqpException } from '@forest-guard/amqp';
import { DataIntegrityService, TokenMintDto, TokenMintService, TokenReadService } from 'nft-folder-blockchain-connector';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Batch } from '@prisma/client';

@Injectable()
export class BatchNftService {
  private readonly batchesUrl = 'https://forest-guard.apps.blockchain-europe.iml.fraunhofer.de/batches/';
  private readonly logger = new Logger(BatchNftService.name);

  constructor(
    private readonly dataIntegrityService: DataIntegrityService,
    private readonly tokenMintService: TokenMintService,
    private readonly tokenReadService: TokenReadService
  ) {}

  public async createDtoForMintingRootNft(batch: Batch, plotOfLandTokenId: number): Promise<TokenMintDto> {
    const hashOfBatch = await this.hashBatch(batch);

    return {
      remoteId: batch.id,
      asset: {
        uri: `${this.batchesUrl}${batch.id}`,
        hash: hashOfBatch,
      },
      metadata: {
        uri: '',
        hash: '',
      },
      additionalData: JSON.stringify({
        plotOfLandTokenId: plotOfLandTokenId,
      }),
      parentIds: [],
    };
  }

  public async mintRootNft(dto: TokenMintDto): Promise<void> {
    const nft = await this.tokenMintService.mintToken(dto, true);
    this.logger.log(JSON.stringify(nft, null, 2));
  }

  public async createDtoForMintingLeafNft(batch: Batch & { parentIds: string[] }): Promise<TokenMintDto> {
    const hashOfBatch = await this.hashBatch(batch);

    return {
      remoteId: batch.id,
      asset: {
        uri: `${this.batchesUrl}${batch.id}`,
        hash: hashOfBatch,
      },
      metadata: {
        uri: '',
        hash: '',
      },
      additionalData: '',
      parentIds: [],
    };
  }

  public async mintLeafNft(dto: TokenMintDto, parentIds: string[], requeueBlockchainRequest: () => void): Promise<void> {
    for (const parentId of parentIds) {
      const parentNfts = await this.tokenReadService.getTokens(parentId);

      if (parentNfts.length === 0) {
        this.logger.log(`No NFT found for parent Batch '${parentId}'. Putting request back into queue.`);
        requeueBlockchainRequest();
        return;
      } else if (parentNfts.length > 1) {
        throw new AmqpException(
          `${parentNfts.length} NFTs found for parent Batch '${parentId}'. Unable to determine which one to use as a parent.`,
          HttpStatus.CONFLICT
        );
      }

      dto.parentIds.push(parentNfts[0].tokenId);
    }

    const nft = await this.tokenMintService.mintToken(dto, true);
    this.logger.log(JSON.stringify(nft, null, 2));
  }

  private async hashBatch(batch: Batch | (Batch & { parentIds: string[] })): Promise<string> {
    const batchToHash = {
      id: batch.id,
      euInfoSystemId: batch.euInfoSystemId,
      weight: batch.weight,
      parentIds: 'parentIds' in batch ? batch.parentIds : [],
      recipientId: batch.recipientId,
      processStepId: batch.processStepId,
    };
    const stringifiedBatchToHash = JSON.stringify(batchToHash);
    const bufferToHash: Buffer = Buffer.from(stringifiedBatchToHash, 'utf-8');
    return this.dataIntegrityService.hashData(bufferToHash);
  }
}
