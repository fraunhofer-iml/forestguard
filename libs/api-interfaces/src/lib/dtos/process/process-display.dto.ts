import { ProcessStepDto } from './process-step.dto';

export class ProcessDisplayDto {
  coffeeBatches?: CoffeeBatch[];
  edges?: Edge[];

  constructor(coffeeBatches?: CoffeeBatch[], edges?: Edge[]) {
    this.coffeeBatches = coffeeBatches;
    this.edges = edges;
  }
}

export class CoffeeBatch {
  id?: string;
  weight?: number;
  recipient?: string;
  processStep?: ProcessStepDto;

  constructor(id?: string, weight?: number, recipient?: string, processStep?: ProcessStepDto) {
    this.id = id;
    this.weight = weight;
    this.recipient = recipient;
    this.processStep = processStep;
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
