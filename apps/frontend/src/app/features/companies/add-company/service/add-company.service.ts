import { AddressCreateDto, CompanyCreateDto } from '@forest-guard/api-interfaces';
import { FormGroup } from '@angular/forms';
import { CompanyForm } from '../model/forms';

export class AddCompanyService {
  public generateAddress(formGroup: FormGroup<CompanyForm>): AddressCreateDto {
    return new AddressCreateDto(
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
