import { FarmerCreateDto, RoleType, UserUpdateDto } from '@forest-guard/api-interfaces';

export function userCreate({ dto, entityId, companyId }: { dto: UserUpdateDto; entityId: string; companyId: string }) {
  return {
    data: user({ dto, entityId, companyId }),
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
        connectOrCreate: {
          create: address(dto),
          where: {
            street_postalCode_city_state_country: address(dto),
          },
        },
      },
      personalId: dto.personalId,
    },
    include: {
      address: true,
    },
  };
}

function user({ dto, entityId, companyId }: { dto: UserUpdateDto; entityId: string; companyId: string }) {
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

function address(dto: FarmerCreateDto) {
  return {
    street: dto.address.street,
    city: dto.address.city,
    state: dto.address.state,
    postalCode: dto.address.postalCode,
    country: dto.address.country,
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
