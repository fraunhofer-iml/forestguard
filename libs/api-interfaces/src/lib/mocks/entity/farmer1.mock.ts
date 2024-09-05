import { UserOrFarmerDto } from '../../dtos';
import { address1Mock } from '../address';
import { plotOfLand1Mock } from '../plot-of-land';

export const farmer1Mock: UserOrFarmerDto = {
  id: 'ctest102',
  employeeId: 'f1',
  firstName: 'Guillermo',
  lastName: 'McFarland',
  email: 'user@example.com',
  role: 'FARMER',
  mobilePhoneNumber: '+5114841701',
  personalId: 'pf1',
  address: address1Mock,
  plotsOfLand: [plotOfLand1Mock],
};
