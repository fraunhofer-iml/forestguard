import { BatchDto } from '../../dtos';
import { user1Mock } from '../entity';
import { processStep1Mock } from '../process';

export const batch1Mock: BatchDto = {
  id: '8918e6b7-e288-4f95-bc87-9d8530e66ad1',
  idEUInfoSystem: 'EU Info',
  weight: 0,
  active : true,
  recipient: user1Mock,
  processStep: processStep1Mock
}
