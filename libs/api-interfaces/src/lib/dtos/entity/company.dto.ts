import { EntityDto } from './entity.dto';
import { AddressDto } from './address.dto';
import { UserDto } from './user.dto';
import { FarmerDto } from './farmer.dto';

export interface CompanyDto extends EntityDto {
  name: string;
  address: AddressDto;
  employees?: UserDto[];
  farmers?: FarmerDto[];
}
