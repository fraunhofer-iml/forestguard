/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
      personalId: dto.personalId,
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
    employeeId: dto.employeeId,
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
