import { CompanyDto } from '@forrest-guard/api-interfaces';
import { CompanyWithRelations } from '../company.types';

const COMPANY_PRISMA_MOCK: CompanyWithRelations = {
  id: 'ctest103',
  name: 'Acme Corp',
  entityId: 'ctest103',
  addressId: 'ctest201',
  address: {
    id: 'ctest201',
    street: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62704',
    country: 'USA',
  },
  users: [
    {
      id: 'ctest101',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@acme.com',
      mobilePhoneNumber: '555-987-6543',
      role: 'EMPLOYEE',
      entityId: 'ctest101',
      companyId: 'ctest103',
      employeeId: 'EID12345678',
      addressId: null,
      personalId: null,
      address: null,
      plotsOfLand: [],
    },
    {
      id: 'ctest102',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@acme.com',
      mobilePhoneNumber: '555-123-4567',
      role: 'FARMER',
      entityId: 'ctest102',
      companyId: 'ctest103',
      employeeId: 'EID23456789',
      addressId: 'ctest202',
      personalId: 'PID12345678',
      address: {
        id: 'ctest202',
        street: '456 Elm St',
        city: 'Shelbyville',
        state: 'IN',
        postalCode: '46176',
        country: 'USA',
      },
      plotsOfLand: [
        {
          id: 'ctest401',
          country: 'USA',
          region: 'Midwest',
          district: 'District 9',
          nationalPlotOfLandId: 'US-987654321',
          localPlotOfLandId: 'IN-123456789',
          description: 'A large plot of fertile land in the Midwest.',
          polygonData: 'POLYGON((...))',
          areaInHA: 100,
          cultivationId: 'ctest301',
          farmerId: 'ctest102',
          cultivatedWith: { id: 'ctest301', type: 'Corn', sort: 'Dent Corn' },
          proofs: [
            {
              documentId: 'DOC123456',
              type: 'PROOF_OF_FREEDOM',
              documentRef: 'ORG123456',
              notice: 'This land is certified organic.',
              plotOfLandId: 'ctest401',
            },
          ],
        },
      ],
    },
  ],
};

const COMPANY_DTO_MOCK: CompanyDto = {
  id: 'ctest103',
  name: 'Acme Corp',
  address: {
    street: '123 Main St',
    postalCode: '62704',
    city: 'Springfield',
    state: 'IL',
    country: 'USA',
  },
  employees: [
    {
      id: 'ctest101',
      employeeId: 'EID12345678',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@acme.com',
      mobilePhoneNumber: '555-987-6543',
      role: 'EMPLOYEE',
    },
  ],
  farmers: [
    {
      id: 'ctest102',
      employeeId: 'EID23456789',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@acme.com',
      mobilePhoneNumber: '555-123-4567',
      role: 'FARMER',
      personalId: 'PID12345678',
      address: {
        street: '456 Elm St',
        postalCode: '46176',
        city: 'Shelbyville',
        state: 'IN',
        country: 'USA',
      },
      plotOfLands: [
        {
          id: 'ctest401',
          country: 'USA',
          region: 'Midwest',
          district: 'District 9',
          nationalPlotOfLandId: 'US-987654321',
          localPlotOfLandId: 'IN-123456789',
          description: 'A large plot of fertile land in the Midwest.',
          polygonData: 'POLYGON((...))',
          areaInHA: 100,
          cultivatedWith: {
            id: 'ctest301',
            type: 'Corn',
            sort: 'Dent Corn',
          },
          proofs: [
            {
              documentId: 'DOC123456',
              type: 'PROOF_OF_FREEDOM',
              documentRef: 'ORG123456',
              notice: 'This land is certified organic.',
            },
          ],
        },
      ],
    },
  ],
};

export { COMPANY_PRISMA_MOCK, COMPANY_DTO_MOCK };
