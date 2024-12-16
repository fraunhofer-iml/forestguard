import { AmqpException } from '@forest-guard/amqp';
import { ConfigurationService } from '@forest-guard/configuration';
import { TokenMintDto } from '@nft-folder/blockchain-connector';
import { HttpStatus, Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
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
  private readonly DURATION_IN_MS = 500;
  private readonly MAX_BLOCKCHAIN_REQUEST_RETRIES = 10;

  private isRunning = true;
  private blockchainEnabled: boolean;
  private blockchainRequestQueue: BlockchainRequest[] = [];

  constructor(
    @Inject(BatchNftService) private readonly batchNftService: BatchNftService,
    @Inject(ConfigurationService) private readonly configurationService: ConfigurationService,
    @Inject(Logger) private readonly logger: Logger,
    @Inject(PlotOfLandNftService) private readonly plotOfLandNftService: PlotOfLandNftService
  ) {
    this.blockchainEnabled = this.configurationService?.getGeneralConfiguration()?.blockchainEnabled || false;

    if (this.blockchainEnabled) {
      this.logger.log('### Blockchain is ENABLED. Worker is starting... ###');
      this.startWorker();
    } else {
      this.logger.log('### Blockchain is DISABLED. Worker will not start. ###');
    }
  }

  async onModuleDestroy() {
    this.isRunning = false;
  }

  private async startWorker() {
    // TODO-MP: check node worker thread
    while (this.isRunning) {
      if (this.blockchainRequestQueue.length === 0) {
        await this.waitForDelay(this.DURATION_IN_MS);
      } else {
        this.logger.log({
          message: 'Getting the next element in the blockchain request queue',
          blockchainRequestQueue: this.blockchainRequestQueue.length,
        });
        const firstBlockchainRequestFromQueue = this.blockchainRequestQueue.shift();

        if (firstBlockchainRequestFromQueue) {
          await this.processBlockchainRequest(firstBlockchainRequestFromQueue);
        }
      }
    }
  }

  private waitForDelay(durationInMilliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, durationInMilliseconds));
  }

  private async processBlockchainRequest(blockchainRequest: BlockchainRequest) {
    this.logger.log({
      message: 'Processing blockchain request',
      blockchainRequestType: blockchainRequest.type,
      blockchainRequestRetry: blockchainRequest.numberOfRetries,
    });

    blockchainRequest.numberOfRetries++;

    const { type, dto, parentIds, numberOfRetries } = blockchainRequest;

    if (numberOfRetries > this.MAX_BLOCKCHAIN_REQUEST_RETRIES) {
      throw new AmqpException(
        `Number of maximum retries (${this.MAX_BLOCKCHAIN_REQUEST_RETRIES}) exceeded for blockchain request of type: ${type}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
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
