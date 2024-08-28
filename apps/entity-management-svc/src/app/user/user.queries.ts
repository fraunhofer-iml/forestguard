import { FarmerCreateDto, RoleType, UserUpdateDto } from '@forest-guard/api-interfaces';
import { User } from '@prisma/client';

export function userCreate({ dto, companyId }: { dto: UserUpdateDto; companyId: string }) {
  return {
    data: user({ dto, companyId }),
  };
}

export function farmerCreate({ dto, companyId }: { dto: FarmerCreateDto; companyId: string }) {
  return {
    data: {
      ...user({ dto, companyId }),
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

export function createEntityFromUser(user: User) {
  return {
    data: {
      id: user.id,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  };
}

function user({ dto, companyId }: { dto: UserUpdateDto; companyId: string }) {
  return {
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
