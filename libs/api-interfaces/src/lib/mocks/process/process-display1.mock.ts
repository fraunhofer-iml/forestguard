import { ProcessDisplayDto } from '../../dtos';

export const processDisplay1Mock: ProcessDisplayDto = {
  coffeeBatches: [
    {
      id: '5122ea21-c437-4458-9102-279111269703',
      weight: 0,
      recipient: '13c9913c-d324-43d1-b834-f536a9e0453c',
      //processStep: '6eb8e77c-cc08-44de-9b7a-2cdfc9387e7d'
    },
  ],
  edges: [
    {
      from: '8918e6b7-e288-4f95-bc87-9d8530e66ad1',
      to: 'baa546c7-70be-4769-9723-d8e991c09aec',
    },
  ],
};
