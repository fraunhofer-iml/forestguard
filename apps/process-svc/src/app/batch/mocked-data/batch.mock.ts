/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BatchCombinedCreateDto, BatchCreateDto, ProofType } from '@forest-guard/api-interfaces';
import { Batch, Role } from '@prisma/client';
import { BatchWithRelations } from '../types/batch.types';

export const mockedCreateBatchDto: BatchCreateDto = {
  euInfoSystemId: null,
  ins: [],
  weight: 33,
  recipient: 'ctest102',
  processStep: {
    location: '',
    dateOfProcess: '2024-05-24T08:28:24Z',
    process: null,
    recordedBy: 'ctest102',
    executedBy: 'ctest101',
    harvestedLand: 'ctest401',
  },
};

export const mockedCombinedBatchDto: BatchCombinedCreateDto = {
  euInfoSystemId: null,
  weight: 33,
  recipient: 'ctest102',
  processStep: {
    location: '',
    dateOfProcess: '2024-05-24T08:28:24Z',
    recordedBy: 'ctest102',
    executedBy: 'ctest101',
    harvestedLands: ['harvestedLand1', 'harvestedLand2', 'harvestedLand3'],
  },
};

export const mockedPrismaBatchWithRelations1: BatchWithRelations & { ins: [] } = {
  id: '1',
  euInfoSystemId: '1',
  hsCode: "090121",
  weight: 100,
  active: true,
  recipientId: '1',
  processStepId: '1',
  processStep: {
    id: '1',
    location: 'Location1',
    dateOfProcess: new Date(),
    dateOfEntry: new Date(),
    processId: '1',
    farmedLandId: '1',
    executedByEntityId: '1',
    recordedByEntityId: '1',
    process: {
      id: '1',
      name: 'Process1',
    },
    documents: [],
    farmedLand: {
      id: '1',
      country: 'Country1',
      areaInHA: 100,
      cultivationId: '1',
      description: 'Description1',
      district: 'District1',
      farmerId: '1',
      localPlotOfLandId: '1',
      nationalPlotOfLandId: '1',
      geoData: 'geoData1',
      region: 'Region1',
      province: 'Province1',
      cultivatedWith: {
        id: 'ctest301',
        commodity: 'Corn',
        sort: 'Dent Corn',
        quality: 'Ecol',
      },
      proofs: [
        {
          documentId: 'DOC123456',
          type: ProofType.PROOF_OF_FREEDOM,
          documentRef: 'ORG123456',
          notice: 'This land is certified organic.',
          plotOfLandId: 'ctest401',
        },
        {
          documentId: 'DOC123456',
          type: ProofType.PROOF_OF_FREEDOM,
          documentRef: 'ORG123456',
          notice: 'This land is certified organic.',
          plotOfLandId: 'ctest401',
        },
      ],
    },
    recordedBy: {
      id: '1',
      user: {
        id: '1',
        firstName: 'User1FirstName',
        lastName: 'User1LastName',
        email: 'user1@example.com',
        mobilePhoneNumber: '1234567890',
        role: Role.EMPLOYEE,
        entityId: '1',
        companyId: '1',
        employeeId: '1',
        addressId: '1',
        personalId: '1',
        address: {
          id: '3',
          street: 'Street3',
          city: 'City3',
          state: 'State3',
          postalCode: 'PostalCode3',
          country: 'Country3',
          additionalInformation: 'good to know',
        },
      },
      company: {
        id: '1',
        name: 'Company1',
        entityId: '1',
        addressId: '1',
        address: {
          id: '1',
          street: 'Street1',
          city: 'City1',
          state: 'State1',
          postalCode: 'PostalCode1',
          country: 'Country1',
          additionalInformation: 'good to know',
        },
      },
    },
    executedBy: {
      id: '2',
      user: {
        id: '2',
        firstName: 'User2FirstName',
        lastName: 'User2LastName',
        email: 'user2@example.com',
        mobilePhoneNumber: '2345678901',
        role: Role.FARMER,
        entityId: '2',
        companyId: '2',
        employeeId: '2',
        addressId: '2',
        personalId: '2',
        address: {
          id: '3',
          street: 'Street3',
          city: 'City3',
          state: 'State3',
          postalCode: 'PostalCode3',
          country: 'Country3',
          additionalInformation: 'good to know',
        },
      },
      company: {
        id: '2',
        name: 'Company2',
        entityId: '2',
        addressId: '2',
        address: {
          id: '2',
          street: 'Street2',
          city: 'City2',
          state: 'State2',
          postalCode: 'PostalCode2',
          country: 'Country2',
          additionalInformation: 'good to know',
        },
      },
    },
  },
  recipient: {
    id: '1',
    user: {
      id: '3',
      firstName: 'RecipientFirstName',
      lastName: 'RecipientLastName',
      email: 'recipient@example.com',
      mobilePhoneNumber: '3456789012',
      role: Role.EMPLOYEE,
      entityId: '3',
      companyId: '3',
      employeeId: '3',
      addressId: '3',
      personalId: '3',
      address: {
        id: '3',
        street: 'Street3',
        city: 'City3',
        state: 'State3',
        postalCode: 'PostalCode3',
        country: 'Country3',
        additionalInformation: 'good to know',
      },
    },
    company: {
      id: '3',
      name: 'RecipientCompany',
      entityId: '3',
      addressId: '3',
      address: {
        id: '3',
        street: 'Street3',
        city: 'City3',
        state: 'State3',
        postalCode: 'PostalCode3',
        country: 'Country3',
        additionalInformation: 'good to know',
      },
    },
  },
  ins: [],
};

export const mockedPrismaBatchWithRelations2: BatchWithRelations = {
  id: '2',
  euInfoSystemId: '2',
  hsCode: "090121",
  weight: 200,
  active: false,
  recipientId: '2',
  processStepId: '2',
  processStep: {
    id: '2',
    location: 'Location2',
    dateOfProcess: new Date(),
    dateOfEntry: new Date(),
    processId: '2',
    farmedLandId: '2',
    executedByEntityId: '2',
    recordedByEntityId: '2',
    process: {
      id: '2',
      name: 'Process2',
    },
    documents: [],
    farmedLand: {
      id: '2',
      country: 'Country2',
      areaInHA: 200,
      cultivationId: '2',
      description: 'Description2',
      district: 'District2',
      farmerId: '2',
      localPlotOfLandId: '2',
      nationalPlotOfLandId: '2',
      geoData: 'geoData2',
      region: 'Region2',
      province: 'Province1',
      cultivatedWith: {
        id: 'ctest301',
        commodity: 'Corn',
        sort: 'Dent Corn',
        quality: 'Ecol',
      },
      proofs: [
        {
          documentId: 'DOC123456',
          type: ProofType.PROOF_OF_FREEDOM,
          documentRef: 'ORG123456',
          notice: 'This land is certified organic.',
          plotOfLandId: 'ctest401',
        },
        {
          documentId: 'DOC123456',
          type: ProofType.PROOF_OF_FREEDOM,
          documentRef: 'ORG123456',
          notice: 'This land is certified organic.',
          plotOfLandId: 'ctest401',
        },
      ],
    },
    recordedBy: {
      id: '2',
      company: {
        id: '2',
        name: 'Company2',
        entityId: '2',
        addressId: '2',
        address: {
          id: '2',
          street: 'Street2',
          city: 'City2',
          state: 'State2',
          postalCode: 'PostalCode2',
          country: 'Country2',
          additionalInformation: 'good to know',
        },
      },
    },
    executedBy: {
      id: '1',
      company: {
        id: '1',
        name: 'Company1',
        entityId: '1',
        addressId: '1',
        address: {
          id: '1',
          street: 'Street1',
          city: 'City1',
          state: 'State1',
          postalCode: 'PostalCode1',
          country: 'Country1',
          additionalInformation: 'good to know',
        },
      },
    },
  },
  recipient: {
    id: '2',
    company: {
      id: '2',
      name: 'RecipientCompany',
      entityId: '2',
      addressId: '2',
      address: {
        id: '2',
        street: 'Street2',
        city: 'City2',
        state: 'State2',
        postalCode: 'PostalCode2',
        country: 'Country2',
        additionalInformation: 'good to know',
      },
    },
  },
};

export const mockedPrismaBatchWithRelations3: BatchWithRelations = {
  id: '3',
  euInfoSystemId: '2',
  hsCode: "090121",
  weight: 200,
  active: false,
  recipientId: '2',
  processStepId: '2',
  processStep: {
    id: '2',
    location: 'Location2',
    dateOfProcess: new Date(),
    dateOfEntry: new Date(),
    processId: '2',
    farmedLandId: '2',
    executedByEntityId: '2',
    recordedByEntityId: '2',
    process: {
      id: '2',
      name: 'Process2',
    },
    documents: [],
    farmedLand: {
      id: '2',
      country: 'Country2',
      areaInHA: 200,
      cultivationId: '2',
      description: 'Description2',
      district: 'District2',
      farmerId: '2',
      localPlotOfLandId: '2',
      nationalPlotOfLandId: '2',
      geoData: 'geoData2',
      region: 'Region2',
      province: 'Province1',
      cultivatedWith: {
        id: 'ctest301',
        commodity: 'Corn',
        sort: 'Dent Corn',
        quality: 'Ecol',
      },
      proofs: [
        {
          documentId: 'DOC123456',
          type: ProofType.PROOF_OF_FREEDOM,
          documentRef: 'ORG123456',
          notice: 'This land is certified organic.',
          plotOfLandId: 'ctest401',
        },
      ],
    },
    recordedBy: {
      id: '2',
      company: {
        id: '2',
        name: 'Company2',
        entityId: '2',
        addressId: '2',
        address: {
          id: '2',
          street: 'Street2',
          city: 'City2',
          state: 'State2',
          postalCode: 'PostalCode2',
          country: 'Country2',
          additionalInformation: 'good to know',
        },
      },
    },
    executedBy: {
      id: '1',
      company: {
        id: '1',
        name: 'Company1',
        entityId: '1',
        addressId: '1',
        address: {
          id: '1',
          street: 'Street1',
          city: 'City1',
          state: 'State1',
          postalCode: 'PostalCode1',
          country: 'Country1',
          additionalInformation: 'good to know',
        },
      },
    },
  },
  recipient: {
    id: '2',
    company: {
      id: '2',
      name: 'RecipientCompany',
      entityId: '2',
      addressId: '2',
      address: {
        id: '2',
        street: 'Street2',
        city: 'City2',
        state: 'State2',
        postalCode: 'PostalCode2',
        country: 'Country2',
        additionalInformation: 'good to know',
      },
    },
  },
};

export const mockedPrismaBatchWithRelations4: BatchWithRelations = {
  id: '4',
  euInfoSystemId: '2',
  hsCode: "090121",
  weight: 200,
  active: false,
  recipientId: '2',
  processStepId: '2',
  processStep: {
    id: '2',
    location: 'Location2',
    dateOfProcess: new Date(),
    dateOfEntry: new Date(),
    processId: '2',
    farmedLandId: '2',
    executedByEntityId: '2',
    recordedByEntityId: '2',
    process: {
      id: '2',
      name: 'Process2',
    },
    documents: [],
    farmedLand: {
      id: '2',
      country: 'Country2',
      areaInHA: 200,
      cultivationId: '2',
      description: 'Description2',
      district: 'District2',
      farmerId: '2',
      localPlotOfLandId: '2',
      nationalPlotOfLandId: '2',
      geoData: 'GeoData2',
      region: 'Region2',
      province: 'Province1',
      cultivatedWith: {
        id: 'ctest301',
        commodity: 'Corn',
        sort: 'Dent Corn',
        quality: 'Ecol',
      },
      proofs: [
        {
          documentId: 'DOC123456',
          type: ProofType.PROOF_OF_FREEDOM,
          documentRef: 'ORG123456',
          notice: 'This land is certified organic.',
          plotOfLandId: 'ctest401',
        },
      ],
    },
    recordedBy: {
      id: '2',
      company: {
        id: '2',
        name: 'Company2',
        entityId: '2',
        addressId: '2',
        address: {
          id: '2',
          street: 'Street2',
          city: 'City2',
          state: 'State2',
          postalCode: 'PostalCode2',
          country: 'Country2',
          additionalInformation: 'good to know',
        },
      },
    },
    executedBy: {
      id: '1',
      company: {
        id: '1',
        name: 'Company1',
        entityId: '1',
        addressId: '1',
        address: {
          id: '1',
          street: 'Street1',
          city: 'City1',
          state: 'State1',
          postalCode: 'PostalCode1',
          country: 'Country1',
          additionalInformation: 'good to know',
        },
      },
    },
  },
  recipient: {
    id: '2',
    company: {
      id: '2',
      name: 'RecipientCompany',
      entityId: '2',
      addressId: '2',
      address: {
        id: '2',
        street: 'Street2',
        city: 'City2',
        state: 'State2',
        postalCode: 'PostalCode2',
        country: 'Country2',
        additionalInformation: 'good to know',
      },
    },
  },
};

export const mockedPrismaBatch4: Batch & { ins: Batch[]; outs: Batch[] } = {
  ...mockedPrismaBatchWithRelations4,
  ins: [],
  outs: [],
};

export const mockedPrismaBatch3: Batch & { ins: Batch[]; outs: Batch[] } = {
  ...mockedPrismaBatchWithRelations3,
  ins: [],
  outs: [],
};

export const mockedPrismaBatch2: Batch & { ins: Batch[]; outs: Batch[] } = {
  ...mockedPrismaBatchWithRelations2,
  ins: [mockedPrismaBatchWithRelations1],
  outs: [mockedPrismaBatch3, mockedPrismaBatch4],
};

export const mockedPrismaBatch1: BatchWithRelations & { ins: Batch[]; outs: Batch[] } = {
  ...mockedPrismaBatchWithRelations1,
  ins: [],
  outs: [mockedPrismaBatch2],
};

export const mockedPrismaBatchRelations = [
  {
    B: 'clx4fzcrh00001z7u086f78oj',
    A: 'clxa4gnuw00005nam96my7yw8',
  },
  {
    B: 'clx3c5o7i0002127ulhkouwlh',
    A: 'clxa4gnuw00005nam96my7yw8',
  },
  {
    B: 'clx3c4n2p0000127u45e6nlgu',
    A: 'clxa4gnuw00005nam96my7yw8',
  },
];

export const mockedExportBatchWithRelations1 = {
  ...mockedPrismaBatchWithRelations1,
  ins: [],
  outs: [mockedPrismaBatchWithRelations2],
};

export const mockedExportBatchWithRelations2 = {
  ...mockedPrismaBatchWithRelations2,
  ins: [mockedExportBatchWithRelations1],
  outs: [mockedExportBatchWithRelations1],
};

export const mockedExportBatchDto = {
  ...mockedPrismaBatchWithRelations1,
  ins: [mockedExportBatchWithRelations2],
  outs: [],
};
