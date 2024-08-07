import { User } from '@prisma/client';

const USER_PRISMA_MOCK: User = {
  id: 'ctest101',
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@acme.com',
  mobilePhoneNumber: '555-987-6543',
  role: 'EMPLOYEE',
  employeeId: 'EID12345678',
  entityId: 'ctest101',
  companyId: 'ctest103',
  addressId: null,
  personalId: null,
};

export { USER_PRISMA_MOCK };
