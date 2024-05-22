import { AddressDto } from './address.dto';

export class CompanyCreateDto {
  name: string;
  address: AddressDto;

  constructor(name: string, address: AddressDto) {
    this.name = name;
    this.address = address;
  }
}
