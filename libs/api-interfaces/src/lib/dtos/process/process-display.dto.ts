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
