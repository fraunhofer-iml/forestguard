import { FarmerDto, UserDto } from '@forest-guard/api-interfaces';
import { Address, User } from '@prisma/client';

export function toUserDto(user: User): UserDto {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { entityId, companyId, addressId, personalId, ...cleansedUser } = user;
  return cleansedUser;
}

export function toFarmerDto(farmer: User & { address: Address }): FarmerDto {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { entityId, companyId, addressId, ...cleansedFarmer } = farmer;
  return cleansedFarmer;
}
