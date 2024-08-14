import { UserOrFarmerDto } from '.';
import { AddressDto } from './address.dto';
import { UserDto } from './user.dto';

export class CompanyDto {
  id: string;
  name: string;
  address: AddressDto;
  employees?: UserDto[];
  farmers?: UserOrFarmerDto[];

  constructor(id: string, name: string, address: AddressDto, employees?: UserDto[], farmers?: UserOrFarmerDto[]) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.employees = employees;
    this.farmers = farmers;
  }
}
