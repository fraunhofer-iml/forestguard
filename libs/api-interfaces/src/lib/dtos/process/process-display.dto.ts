export interface ProcessDisplayDto {
  coffeeBatches? : CoffeeBatch[];
  edges?: Edge[];
}

interface CoffeeBatch {
  id?: string;
  weight?: number;
  recipient?: string;
  processStep?: string;
}

interface Edge {
  from?: string;
  to?: string;
}
