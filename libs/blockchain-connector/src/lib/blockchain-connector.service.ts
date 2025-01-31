/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AmqpException } from '@forest-guard/amqp';
import { ConfigurationService } from '@forest-guard/configuration';
import { TokenMintDto } from 'nft-folder-blockchain-connector';
import { HttpStatus, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Batch, PlotOfLand, Proof } from '@prisma/client';
import { BatchNftService } from './batch-nft.service';
import { PlotOfLandNftService, PlotOfLandTokenUpdateDto } from './plot-of-land-nft.service';

enum BlockchainRequestType {
  MINT_PLOT_OF_LAND_NFT = 'MINT_PLOT_OF_LAND_NFT',
  UPDATE_PLOT_OF_LAND_NFT = 'UPDATE_PLOT_OF_LAND_NFT',
  MINT_BATCH_ROOT_NFT = 'MINT_BATCH_ROOT_NFT',
  MINT_BATCH_LEAF_NFT = 'MINT_BATCH_LEAF_NFT',
}

type BlockchainRequest = {
  type: BlockchainRequestType;
  dto: TokenMintDto | PlotOfLandTokenUpdateDto;
  parentIds?: string[];
  numberOfRetries: number;
};

@Injectable()
export class BlockchainConnectorService implements OnModuleDestroy {
  private readonly logger = new Logger(BlockchainConnectorService.name);
  private readonly delayInMs = 500;
  private readonly maxRetries = 10;
  private readonly blockchainRequestQueue: BlockchainRequest[] = [];

  private serviceRunning = true;
  private blockchainEnabled = false;

  constructor(
    private readonly batchNftService: BatchNftService,
    private readonly configurationService: ConfigurationService,
    private readonly plotOfLandNftService: PlotOfLandNftService
  ) {
    this.blockchainEnabled = this.configurationService?.getGeneralConfiguration()?.blockchainEnabled || false;

    if (this.blockchainEnabled) {
      this.logger.log('### Blockchain is ENABLED. Worker is starting... ###');
      this.startWorker();
    } else {
      this.logger.log('### Blockchain is DISABLED. Worker will not start. ###');
    }
  }

  public async onModuleDestroy() {
    this.serviceRunning = false;
  }

  private async startWorker() {
    while (this.serviceRunning) {
      if (this.blockchainRequestQueue.length === 0) {
        await this.delayBlockchainRequest();
      } else {
        await this.handleBlockchainRequest();
      }
    }
  }

  private async delayBlockchainRequest(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.delayInMs));
  }

  private async handleBlockchainRequest() {
    this.logger.log(`Handling blockchain request | Queue length: ${this.blockchainRequestQueue.length}`);

    const firstBlockchainRequestFromQueue = this.blockchainRequestQueue.shift();

    if (firstBlockchainRequestFromQueue) {
      if (firstBlockchainRequestFromQueue.numberOfRetries > 0) {
        await this.delayBlockchainRequest();
      }
      await this.processBlockchainRequest(firstBlockchainRequestFromQueue);
    }
  }

  private async processBlockchainRequest(blockchainRequest: BlockchainRequest) {
    const id: string = 'remoteId' in blockchainRequest.dto ? blockchainRequest.dto.remoteId : blockchainRequest.dto.plotOfLandId;
    this.logger.log(
      `Processing blockchain request | ID: ${id} | Type: ${blockchainRequest.type} | Retries: ${blockchainRequest.numberOfRetries}`
    );

    blockchainRequest.numberOfRetries++;

    const { type, dto, parentIds, numberOfRetries } = blockchainRequest;

    if (numberOfRetries > this.maxRetries) {
      // We should not throw an exception here, as this would stop the worker thread
      this.logger.error(`Number of maximum retries (${this.maxRetries}) exceeded for blockchain request of type: ${type}`);
      return;
    }

    switch (type) {
      case BlockchainRequestType.MINT_PLOT_OF_LAND_NFT:
        await this.plotOfLandNftService.mintNft(dto as TokenMintDto);
        break;
      case BlockchainRequestType.UPDATE_PLOT_OF_LAND_NFT:
        await this.plotOfLandNftService.updateNft(dto as PlotOfLandTokenUpdateDto, () =>
          this.blockchainRequestQueue.push(blockchainRequest)
        );
        break;
      case BlockchainRequestType.MINT_BATCH_ROOT_NFT:
        await this.batchNftService.mintRootNft(dto as TokenMintDto);
        break;
      case BlockchainRequestType.MINT_BATCH_LEAF_NFT:
        if (!parentIds) {
          throw new AmqpException('parentIds is undefined', HttpStatus.BAD_REQUEST);
        }
        await this.batchNftService.mintLeafNft(dto as TokenMintDto, parentIds, () => this.blockchainRequestQueue.push(blockchainRequest));
        break;
      default:
        throw new AmqpException(`Unknown BlockchainRequestType: ${type}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async mintPlotOfLandNft(plotOfLand: PlotOfLand): Promise<void> {
    if (!this.blockchainEnabled) {
      return;
    }

    const dto: TokenMintDto = await this.plotOfLandNftService.createDtoForMintingNft(plotOfLand);

    this.blockchainRequestQueue.push({
      type: BlockchainRequestType.MINT_PLOT_OF_LAND_NFT,
      dto: dto,
      numberOfRetries: 0,
    });
  }

  public async updatePlotOfLandNft(proof: Proof & { plotOfLand: PlotOfLand }): Promise<void> {
    if (!this.blockchainEnabled) {
      return;
    }

    const dto: PlotOfLandTokenUpdateDto = await this.plotOfLandNftService.createDtoForUpdatingNft(proof);

    this.blockchainRequestQueue.push({
      type: BlockchainRequestType.UPDATE_PLOT_OF_LAND_NFT,
      dto: dto,
      numberOfRetries: 0,
    });
  }

  public async mintBatchRootNft(batch: Batch & { plotOfLandId: string }): Promise<void> {
    if (!this.blockchainEnabled) {
      return;
    }

    const plotOfLandTokenId: number = await this.plotOfLandNftService.fetchPlotOfLandTokenId(batch.plotOfLandId);
    const dto: TokenMintDto = await this.batchNftService.createDtoForMintingRootNft(batch, plotOfLandTokenId);

    this.blockchainRequestQueue.push({
      type: BlockchainRequestType.MINT_BATCH_ROOT_NFT,
      dto: dto,
      numberOfRetries: 0,
    });
  }

  public async mintBatchLeafNft(batch: Batch & { parentIds: string[] }): Promise<void> {
    if (!this.blockchainEnabled) {
      return;
    }

    const dto: TokenMintDto = await this.batchNftService.createDtoForMintingLeafNft(batch);

    this.blockchainRequestQueue.push({
      type: BlockchainRequestType.MINT_BATCH_LEAF_NFT,
      dto: dto,
      parentIds: batch.parentIds,
      numberOfRetries: 0,
    });
  }
}
