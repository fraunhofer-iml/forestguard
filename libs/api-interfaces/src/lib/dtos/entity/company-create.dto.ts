import { AddressDto } from './address.dto';

export interface CompanyCreateDto {
  name: string;
  address: AddressDto;
}
