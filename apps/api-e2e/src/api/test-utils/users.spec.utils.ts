import { UserCreateDto } from '@forest-guard/api-interfaces';

export function createVariantOf(givenUser: UserCreateDto, firstName = 'Manuel'): UserCreateDto {
  const userVariant = structuredClone(givenUser);
  userVariant.firstName = firstName;
  return userVariant;
}
