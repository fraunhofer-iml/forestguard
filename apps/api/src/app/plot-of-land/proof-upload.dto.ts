/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
