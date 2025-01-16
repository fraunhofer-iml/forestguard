/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BatchDto } from '../batch';

export class ProcessDisplayDto {
  coffeeBatches?: BatchDto[];
  edges?: Edge[];

  constructor(coffeeBatches?: BatchDto[], edges?: Edge[]) {
    this.coffeeBatches = coffeeBatches;
    this.edges = edges;
  }
}

export class Edge {
  from: string;
  to: string;
  invalid?: boolean = false;

  constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
  }
}
