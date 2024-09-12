import { UserUpdateDto } from '@forest-guard/api-interfaces';

export function createVariantOf(givenUser: UserUpdateDto, firstName = 'Manuel'): UserUpdateDto {
  const userVariant = structuredClone(givenUser);
  userVariant.firstName = firstName;
  return userVariant;
}
