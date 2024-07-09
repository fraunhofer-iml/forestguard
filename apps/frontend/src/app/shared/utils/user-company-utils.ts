import { CompanyDto, UserDto } from '@forrest-guard/api-interfaces';

/**
 * Gets the name of the user or company
 * @param input The data to get the name from
 * @returns The name of the user or company
 */
export const getUserOrCompanyName = (input: UserDto | CompanyDto | undefined): string => {
  if (!input) return '';
  if ((input as UserDto).firstName) {
    input = input as UserDto;
    return `${input.firstName} ${input.lastName}`;
  }
  if ((input as CompanyDto).name) return (input as CompanyDto).name;
  return '';
};
