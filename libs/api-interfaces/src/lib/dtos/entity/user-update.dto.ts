import { AddressCreateDto } from './address-create.dto';

export class UserUpdateDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobilePhoneNumber?: string;
  address?: AddressCreateDto;

  constructor(firstName: string, lastName: string, email: string, mobilePhoneNumber: string, address: AddressCreateDto) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.address = address;
  }
}
