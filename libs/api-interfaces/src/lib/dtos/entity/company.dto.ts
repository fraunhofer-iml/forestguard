import { AddressDto } from './address.dto';
import { FarmerDto } from './farmer.dto';
import { UserDto } from './user.dto';

export class CompanyDto {
  id: string;
  name: string;
  address: AddressDto;
  employees?: UserDto[];
  farmers?: FarmerDto[];

  constructor(id: string, name: string, address: AddressDto, employees?: UserDto[], farmers?: FarmerDto[]) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.employees = employees;
    this.farmers = farmers;
  }
}
