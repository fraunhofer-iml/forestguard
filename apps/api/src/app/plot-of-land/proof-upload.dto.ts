/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProofCreateDto, ProofType } from '@forest-guard/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';

/**
 * This DTO serves as a workaround for the limitation that prevents using NestJS Swagger in the libs/api-interfaces.
 * The Angular application experiences dependency issues when Swagger annotations are included in these shared libraries.
 * To resolve this, we define the DTO with Swagger annotations here instead of in the shared library.
 */
export class ProofUploadDto extends ProofCreateDto {
  @ApiProperty()
  type: ProofType;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
