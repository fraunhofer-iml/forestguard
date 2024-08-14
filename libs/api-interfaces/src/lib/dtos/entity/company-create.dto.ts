import { AddressCreateDto } from './address-create.dto';

export class CompanyCreateDto {
  name: string;
  address: AddressCreateDto;

  constructor(name: string, address: AddressCreateDto) {
    this.name = name;
    this.address = address;
  }
}
