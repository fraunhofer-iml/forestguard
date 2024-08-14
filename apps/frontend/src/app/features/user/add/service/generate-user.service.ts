import { AddressCreateDto, FarmerCreateDto, RoleType, UserUpdateDto } from '@forest-guard/api-interfaces';
import { FormGroup } from '@angular/forms';

export class GenerateUserService {
  generateNewUser(formGroup: FormGroup): UserUpdateDto {
    return new UserUpdateDto(
      formGroup.value.firstName ?? '',
      formGroup.value.lastName ?? '',
      formGroup.value.email ?? '',
      formGroup.value.company ?? '',
      formGroup.value.phoneNumber ?? '',
      RoleType.EMPLOYEE
    );
  }

  generateNewFarmer(formGroup: FormGroup): FarmerCreateDto {
    return new FarmerCreateDto(
      formGroup.value.firstName ?? '',
      formGroup.value.lastName ?? '',
      formGroup.value.email ?? '',
      formGroup.value.company ?? '',
      formGroup.value.phoneNumber ?? '',
      this.generateNewAddress(formGroup)
    );
  }

  generateNewAddress(formGroup: FormGroup): AddressCreateDto {
    return new AddressCreateDto(
      formGroup.value.street ?? '',
      formGroup.value.postalCode ?? '',
      formGroup.value.city ?? '',
      formGroup.value.state ?? '',
      formGroup.value.country ?? ''
    );
  }
}
