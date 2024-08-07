import { Address, User } from '@prisma/client';

const FARMER_PRISMA_MOCK: User & { address: Address } = {
  id: 'ctest102',
  firstName: 'Guillermo',
  lastName: 'McFarland',
  email: 'user@example.com',
  mobilePhoneNumber: '+5114841701',
  role: 'FARMER',
  employeeId: 'EID23456789',
  entityId: 'ctest102',
  companyId: 'ctest103',
  addressId: null,
  address: null,
  personalId: 'pf1',
};

export { FARMER_PRISMA_MOCK };
