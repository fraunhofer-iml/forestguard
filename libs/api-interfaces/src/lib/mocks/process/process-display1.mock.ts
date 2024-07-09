import { ProcessDisplayDto } from '../../dtos';
import { batch1Mock } from '../batch';

export const processDisplay1Mock: ProcessDisplayDto = {
  coffeeBatches: [
    batch1Mock
  ],
  edges: [
    {
      from: '8918e6b7-e288-4f95-bc87-9d8530e66ad1',
      to: 'baa546c7-70be-4769-9723-d8e991c09aec',
    },
  ],
};
