import { BatchDto } from '../../dtos';
import { user1Mock } from '../entity';
import { processStep1Mock } from '../process';
import { batch2Mock } from './batch2.mock';

export const batch3Mock: BatchDto = {
  id: 'baa546c7-70be-4769-9723-d8e991c09aec',
  idEUInfoSystem: 'EU Info',
  in: [batch2Mock],
  out: [],
  weight: 0,
  active : true,
  recipient: user1Mock,
  processStep: processStep1Mock
}
