import { UserUpdateDto } from './user-update.dto';
import { AddressDto } from './address.dto';

export interface FarmerCreateDto extends UserUpdateDto {
  personalId: string;
  address: AddressDto;
}
