import { AddressDto, CompanyCreateDto } from '@forrest-guard/api-interfaces';
import { FormGroup } from '@angular/forms';
import { CompanyForm } from '../model/forms';

export class AddCompanyService {
  public generateAddress(formGroup: FormGroup<CompanyForm>): AddressDto {
    return new AddressDto(
      formGroup.value.street ?? '',
      formGroup.value.postalCode ?? '',
      formGroup.value.city ?? '',
      formGroup.value.state ?? '',
      formGroup.value.country ?? ''
    );
  }

  public generateCompany(formGroup: FormGroup<CompanyForm>): CompanyCreateDto {
    return new CompanyCreateDto(formGroup?.value?.name ?? '', this.generateAddress(formGroup));
  }
}
