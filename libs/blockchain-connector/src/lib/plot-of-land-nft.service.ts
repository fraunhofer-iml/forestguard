/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { buffer } from 'stream/consumers';
import { AmqpException } from '@forest-guard/amqp';
import { FileStorageService } from '@forest-guard/file-storage';
import {
  DataIntegrityService,
  TokenMintDto,
  TokenMintService,
  TokenReadService,
  TokenUpdateDto,
  TokenUpdateService,
} from 'nft-folder-blockchain-connector';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PlotOfLand, Proof } from '@prisma/client';

export type PlotOfLandTokenUpdateDto = {
  plotOfLandId: string;
  plotOfLandHash: string;
  proofSummary: string;
};

@Injectable()
export class PlotOfLandNftService {
  private readonly plotOfLandsUrl = 'https://forest-guard.apps.blockchain-europe.iml.fraunhofer.de/pols/';
  private readonly logger = new Logger(PlotOfLandNftService.name);

  constructor(
    private readonly dataIntegrityService: DataIntegrityService,
    private readonly fileStorageService: FileStorageService,
    private readonly tokenMintService: TokenMintService,
    private readonly tokenReadService: TokenReadService,
    private readonly tokenUpdateService: TokenUpdateService
  ) {}

  private async hashMetadata(plotOfLand: PlotOfLand): Promise<string> {
    const metadata = {
      name: plotOfLand.description || `Plot of Land ${plotOfLand.nationalPlotOfLandId}`,
      description: `Plot of land located in ${plotOfLand.region}, ${plotOfLand.country}`,
      attributes: [
        {
          trait_type: 'Region',
          value: plotOfLand.region,
        },
        {
          trait_type: 'Country',
          value: plotOfLand.country,
        },
        {
          trait_type: 'Area',
          value: `${plotOfLand.areaInHA} HA`,
        },
        {
          trait_type: 'Plot ID',
          value: plotOfLand.nationalPlotOfLandId,
        },
      ],
    };

    const metadataString = JSON.stringify(metadata);
    const buffer = Buffer.from(metadataString, 'utf-8');
    return this.dataIntegrityService.hashData(buffer);
  }

  public async createDtoForMintingNft(plotOfLand: PlotOfLand): Promise<TokenMintDto> {
    const fetchedPlotOfLandNfts = await this.tokenReadService.getTokens(plotOfLand.id);

    if (fetchedPlotOfLandNfts.length > 0) {
      throw new AmqpException(
        `${fetchedPlotOfLandNfts.length} NFT(s) found for PlotOfLand '${plotOfLand.id}'. Unable to create another one.`,
        HttpStatus.CONFLICT
      );
    }

    const plotOfLandHash = await this.hashPlotOfLand(plotOfLand);
    const metadataHash = await this.hashMetadata(plotOfLand);

    return {
      remoteId: plotOfLand.id,
      asset: {
        uri: `${this.plotOfLandsUrl}${plotOfLand.id}`,
        hash: plotOfLandHash,
      },
      metadata: {
        uri: `${this.plotOfLandsUrl}${plotOfLand.id}/metadata`,
        hash: metadataHash,
      },
      additionalData: JSON.stringify({
        proofs: [],
      }),
      parentIds: [],
    };
  }

  public async mintNft(dto: TokenMintDto): Promise<void> {
    this.logger.log(`Minting NFT with data: ${JSON.stringify(dto)}`);

    try {
      const nft = await this.tokenMintService.mintToken(dto, false);
      this.logger.log(JSON.stringify(nft, null, 2));
    } catch (error: any) {
      this.logger.error(`Mint NFT failed: ${error.message}`);

      if (error.transactionReceipt?.logs) {
        this.logger.log(`Available events in transaction receipt:`);
        error.transactionReceipt.logs.forEach((log: any, index: any) => {
          this.logger.log(`Event ${index}: ${JSON.stringify(log, null, 2)}`);
        });
      }

      throw error;
    }
  }

  public async createDtoForUpdatingNft(proof: Proof & { plotOfLand: PlotOfLand }): Promise<PlotOfLandTokenUpdateDto> {
    const plotOfLandId = proof.plotOfLand.id;
    const plotOfLandHash = await this.hashPlotOfLand(proof.plotOfLand);
    const proofSummary = await this.createProofSummary(proof);

    return { plotOfLandId, plotOfLandHash, proofSummary };
  }

  public async updateNft(dto: PlotOfLandTokenUpdateDto, requeueBlockchainRequest: () => void): Promise<void> {
    const fetchedPlotOfLandNfts = await this.tokenReadService.getTokens(dto.plotOfLandId);

    if (fetchedPlotOfLandNfts.length === 0) {
      this.logger.log(`No NFT found for PlotOfLand '${dto.plotOfLandId}'. Putting request back into queue.`);
      requeueBlockchainRequest();
      return;
    } else if (fetchedPlotOfLandNfts.length > 1) {
      throw new AmqpException(
        `${fetchedPlotOfLandNfts.length} NFTs found for PlotOfLand '${dto.plotOfLandId}'. Unable to determine which one to update.`,
        HttpStatus.CONFLICT
      );
    }

    const fetchedPlotOfLandNft = fetchedPlotOfLandNfts[0];

    const additionalData = JSON.parse(fetchedPlotOfLandNft.additionalData);
    additionalData.proofs = [...(additionalData.proofs || []), dto.proofSummary];
    const additionalDataStringified = JSON.stringify({ proofs: additionalData.proofs });

    const tokenUpdateDto: TokenUpdateDto = {
      assetHash: dto.plotOfLandHash,
      additionalData: additionalDataStringified,
    };

    const nft = await this.tokenUpdateService.updateToken(fetchedPlotOfLandNft.tokenId, tokenUpdateDto);
    this.logger.log(JSON.stringify(nft, null, 2));
  }

  public async fetchPlotOfLandTokenId(plotOfLandId: string): Promise<number> {
    const fetchedPlotOfLandNfts = await this.tokenReadService.getTokens(plotOfLandId);

    if (fetchedPlotOfLandNfts.length === 0) {
      throw new AmqpException(`No NFT found for PlotOfLand '${plotOfLandId}'.`, HttpStatus.NOT_FOUND);
    } else if (fetchedPlotOfLandNfts.length > 1) {
      throw new AmqpException(
        `${fetchedPlotOfLandNfts.length} NFTs found for PlotOfLand '${plotOfLandId}'. Unable to determine which one to choose.`,
        HttpStatus.CONFLICT
      );
    }

    return fetchedPlotOfLandNfts[0].tokenId;
  }

  private async hashPlotOfLand(plotOfLand: PlotOfLand): Promise<string> {
    // We hash these properties explicitly instead of the whole object to ensure that the hash for the same PlotOfLand is always the same, regardless of the order of the properties
    const plotOfLandToHash = {
      id: plotOfLand.id,
      country: plotOfLand.country,
      region: plotOfLand.region,
      district: plotOfLand.district,
      nationalPlotOfLandId: plotOfLand.nationalPlotOfLandId,
      localPlotOfLandId: plotOfLand.localPlotOfLandId,
      description: plotOfLand.description,
      geoData: plotOfLand.geoData,
      areaInHA: plotOfLand.areaInHA,
      cultivationId: plotOfLand.cultivationId,
      farmerId: plotOfLand.farmerId,
    };
    const stringifiedPlotOfLandToHash = JSON.stringify(plotOfLandToHash);
    const bufferToHash: Buffer = Buffer.from(stringifiedPlotOfLandToHash, 'utf-8');
    return this.dataIntegrityService.hashData(bufferToHash);
  }

  private async createProofSummary(proof: Proof & { plotOfLand: PlotOfLand }): Promise<string> {
    const proofId = proof.documentId;
    const proofType = proof.type;
    const proofHash = await this.hashProof(proof);
    const documentHash = await this.hashDocument(proof.documentRef);
    return `${proofId}|${proofType}|${proofHash}|${documentHash}`;
  }

  private async hashProof(proof: Proof): Promise<string> {
    // We hash these properties explicitly instead of the whole object to ensure that the hash for the same Proof is always the same, regardless of the order of the properties
    const proofToHash = {
      documentId: proof.documentId,
      type: proof.type,
      documentRef: proof.documentRef,
      notice: proof.notice,
      plotOfLandId: proof.plotOfLandId,
    };
    const stringifiedProofToHash = JSON.stringify(proofToHash);
    const bufferToHash: Buffer = Buffer.from(stringifiedProofToHash, 'utf-8');
    return this.dataIntegrityService.hashData(bufferToHash);
  }

  private async hashDocument(documentRef: string): Promise<string> {
    const documentStream = await this.fileStorageService.downloadFile(documentRef);
    const documentBuffer = await buffer(documentStream);
    return this.dataIntegrityService.hashData(documentBuffer);
  }
}
