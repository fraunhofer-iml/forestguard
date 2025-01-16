import { UserDto, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { Address, User } from '@prisma/client';
import { PlotOfLandWithRelations } from '../company/company.types';

export function toUserDto(user: User): UserDto {
  if (user === null) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { entityId, companyId, addressId, personalId, ...cleanedUser } = user;
  return cleanedUser;
}

export function toUserOrFarmerDto(user: User & { address: Address; plotsOfLand?: PlotOfLandWithRelations[] }): UserOrFarmerDto {
  if (user === null) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { entityId, companyId, addressId, ...cleanedUser } = user;
  return cleanedUser;
}
