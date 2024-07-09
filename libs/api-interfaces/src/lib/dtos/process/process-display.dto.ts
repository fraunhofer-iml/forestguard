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

  constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
  }
}
