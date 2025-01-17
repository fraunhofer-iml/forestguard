/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { FarmerCreateDto, RoleType, UserCreateDto, UserUpdateDto } from '@forest-guard/api-interfaces';

export function userCreate({ dto, entityId, companyId }: { dto: UserCreateDto; entityId: string; companyId: string }) {
  return {
    data: user({ dto, entityId, companyId }),
  };
}

export function userUpdate(id: string, dto: UserUpdateDto) {
  return {
    where: {
      id: id,
    },
    data: {
      ...dto,
      address: {
        update: dto.address,
      },
    },
    include: {
      address: true,
    },
  };
}

export function farmerCreate({ dto, entityId, companyId }: {
  dto: FarmerCreateDto;
  entityId: string;
  companyId: string
}) {
  return {
    data: {
      ...user({ dto, entityId, companyId }),
      role: RoleType.FARMER,
      address: {
        create: dto.address,
      },
      personalId: (dto.personalId !== "") ? dto.personalId : null,
    },
    include: {
      address: true,
    },
  };
}

function user({ dto, entityId, companyId }: { dto: UserCreateDto; entityId: string; companyId: string }) {
  return {
    id: entityId,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    mobilePhoneNumber: dto.mobilePhoneNumber,
    role: dto.role,
    company: {
      connect: {
        id: companyId,
      },
    },
    entity: {
      connect: {
        id: entityId,
      },
    },
    employeeId: (dto.employeeId !== "") ? dto.employeeId : null,
  };
}

export function userOrFarmerReadById(id: string) {
  return {
    where: {
      id: id,
    },
    include: farmerIncludeProperties(),
  };
}

export function farmerReadByPersonalId(personalId: string, companyId: string) {
  return {
    where: {
      companyId_personalId: {
        companyId,
        personalId,
      },
    },
    include: farmerIncludeProperties(),
  };
}
export function farmerReadByCompanyId(companyId: string) {
  return {
    where: {
      role: RoleType.FARMER,
      companyId: companyId,
    },
    include: farmerIncludeProperties(),
  };
}

function farmerIncludeProperties() {
  return {
    address: true,
    plotsOfLand: {
      include: {
        cultivatedWith: true,
        proofs: true,
      },
    },
    documents: true,
  };
}
