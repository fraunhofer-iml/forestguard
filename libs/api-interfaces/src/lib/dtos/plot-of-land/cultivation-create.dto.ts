/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export class CultivationCreateDto {
  sort: string;
  quality: string;

  constructor(sort: string, quality: string) {
    this.sort = sort;
    this.quality = quality;
  }
}
