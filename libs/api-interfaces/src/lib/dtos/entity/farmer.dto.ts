import { PlotOfLandDto } from '../plot-of-land';
import { AddressDto } from './address.dto';
import { UserDto } from './user.dto';

export class FarmerDto extends UserDto {
  personalId: string;
  address: AddressDto;
  plotOfLands?: PlotOfLandDto[];

  constructor(
    id: string,
    employeeId: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    mobilePhoneNumber: string,
    personalId: string,
    address: AddressDto,
    plotOfLands?: PlotOfLandDto[]
  ) {
    super(id, employeeId, firstName, lastName, email, role, mobilePhoneNumber);
    this.personalId = personalId;
    this.address = address;
    this.plotOfLands = plotOfLands;
  }
}
