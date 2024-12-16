import { AddressCreateDto } from './address-create.dto';
import { UserCreateDto } from './user-create.dto';

export class FarmerCreateDto extends UserCreateDto {
  personalId: string;
  address: AddressCreateDto;

  constructor(firstName: string, lastName: string, email: string, personalId: string, mobilePhoneNumber: string, address: AddressCreateDto) {
    super(firstName, lastName, email, personalId, mobilePhoneNumber);
    this.personalId = personalId;
    this.address = address;
  }
}
