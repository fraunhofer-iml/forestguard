import { AddressDto } from './address.dto';
import { UserUpdateDto } from './user-update.dto';

export class FarmerCreateDto extends UserUpdateDto {
  personalId: string;
  address: AddressDto;

  constructor(firstName: string, lastName: string, email: string, personalId: string, address: AddressDto) {
    super(firstName, lastName, email);
    this.personalId = personalId;
    this.address = address;
  }
}
