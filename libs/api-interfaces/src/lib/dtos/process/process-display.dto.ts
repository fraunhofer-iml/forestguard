export class ProcessDisplayDto {
  coffeeBatches?: CoffeeBatch[];
  edges?: Edge[];

  constructor(coffeeBatches?: CoffeeBatch[], edges?: Edge[]) {
    this.coffeeBatches = coffeeBatches;
    this.edges = edges;
  }
}

class CoffeeBatch {
  id?: string;
  weight?: number;
  recipient?: string;
  processStep?: string;

  constructor(id?: string, weight?: number, recipient?: string, processStep?: string) {
    this.id = id;
    this.weight = weight;
    this.recipient = recipient;
    this.processStep = processStep;
  }
}

class Edge {
  from?: string;
  to?: string;

  constructor(from?: string, to?: string) {
    this.from = from;
    this.to = to;
  }
}
