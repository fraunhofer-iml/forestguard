import { AddressDto } from './address.dto';
import { UserUpdateDto } from './user-update.dto';

export class FarmerCreateDto extends UserUpdateDto {
  personalId: string;
  address: AddressDto;

  constructor(firstName: string, lastName: string, email: string, personalId: string, mobilePhoneNumber: string, address: AddressDto) {
    super(firstName, lastName, email, personalId, mobilePhoneNumber);
    this.personalId = personalId;
    this.address = address;
  }
}
