import { AddressCreateDto, UserOrFarmerDto, UserUpdateDto } from '@forest-guard/api-interfaces';

export class UpdateFarmerService {
  convertFarmerToUserUpdateDto(farmer: UserOrFarmerDto): UserUpdateDto {
    return new UserUpdateDto(
      farmer?.firstName,
      farmer?.lastName,
      farmer?.email,
      farmer?.mobilePhoneNumber,
      this.updateAddress(farmer?.address)
    );
  }

  updateAddress(address: AddressCreateDto | undefined): AddressCreateDto {
    if (!address) {
      return new AddressCreateDto('', '', '', '', '', '');
    }
    return new AddressCreateDto(
      address.street,
      address.postalCode,
      address.city,
      address.state,
      address.country,
      address.additionalInformation
    );
  }
}
