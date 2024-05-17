import { AddressDto } from './address.dto';
import { UserDto } from './user.dto';
import { PlotOfLandDto } from '../plot-of-land';

export interface FarmerDto extends UserDto {
  personalId: string;
  address: AddressDto;
  plotOfLands?: PlotOfLandDto[];
}
