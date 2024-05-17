import { BatchDto } from '../../dtos';
import { user1Mock } from '../entity';
import { processStep1Mock } from '../process';
import { batch1Mock } from './batch1.mock';
import { batch3Mock } from './batch3.mock';

export const batch2Mock: BatchDto = {
  id: '5122ea21-c437-4458-9102-279111269703',
  idEUInfoSystem: 'EU Info',
  in: [batch1Mock],
  out: [batch3Mock],
  weight: 0,
  active : true,
  recipient: user1Mock,
  processStep: processStep1Mock
}
