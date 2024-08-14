import { FarmerCreateDto, RoleType, UserUpdateDto } from '@forest-guard/api-interfaces';

export function userCreate(dto: UserUpdateDto) {
  return {
    data: user(dto),
  };
}

export function farmerCreate(dto: FarmerCreateDto) {
  return {
    data: {
      ...user(dto),
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

function user(dto: UserUpdateDto) {
  return {
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    mobilePhoneNumber: dto.mobilePhoneNumber,
    role: dto.role,
    entity: {
      create: {},
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
    include: {
      address: true,
      plotsOfLand: {
        include: {
          cultivatedWith: true,
          proofs: true,
        },
      },
    },
  };
}

export function farmerReadByCompanyId(companyId: string) {
  return {
    where: {
      role: RoleType.FARMER,
      companyId: companyId,
    },
    include: {
      address: true,
      plotsOfLand: {
        include: {
          cultivatedWith: true,
          proofs: true,
        },
      },
    },
  };
}
