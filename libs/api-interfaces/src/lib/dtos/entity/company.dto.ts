import { AddressDto } from './address.dto';
import { EntityDto } from './entity.dto';
import { FarmerDto } from './farmer.dto';
import { UserDto } from './user.dto';

export class CompanyDto extends EntityDto {
  name: string;
  address: AddressDto;
  employees?: UserDto[];
  farmers?: FarmerDto[];

  constructor(id: string, name: string, address: AddressDto, employees?: UserDto[], farmers?: FarmerDto[]) {
    super(id);
    this.name = name;
    this.address = address;
    this.employees = employees;
    this.farmers = farmers;
  }
}
