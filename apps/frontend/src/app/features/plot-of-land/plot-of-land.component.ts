import { CultivationDto, FarmerDto, ProofType, UserDto } from '@forrest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UploadFormSelectType } from '../../shared/components/upload-form/upload-form-select.type';
import { FARMER_ID } from '../../shared/constants';
import { Messages } from '../../shared/messages';
import { CompanyService } from '../../shared/services/company/company.service';
import { CultivationService } from '../../shared/services/cultivation/cultivation.service';
import { PlotOfLandService } from '../../shared/services/plotOfLand/plotOfLand.service';
import { UserService } from '../../shared/services/user/user.service';
import { PlotOfLandForm } from './model/plot-of-land-form';
import { GeneratePlotOfLandService } from './service/generate-plot-of-land.service';

@Component({
  selector: 'app-plot-of-land',
  templateUrl: './plot-of-land.component.html',
})
export class PlotOfLandComponent {
  users$: Observable<UserDto[]>;
  farmers$: Observable<FarmerDto[]>;
  coffeeOptions$: Observable<CultivationDto[]>;
  plotOfLandFormGroup: FormGroup<PlotOfLandForm> = new FormGroup<PlotOfLandForm>({
    processOwner: new FormControl(null, Validators.required),
    region: new FormControl(null, Validators.required),
    plotOfLand: new FormControl(null, Validators.required),
    sortOfCoffee: new FormControl(null, Validators.required),
    localPlotOfLandId: new FormControl(null, Validators.required),
    nationalPlotOfLandId: new FormControl(null, Validators.required),
    polygondata: new FormControl(null, Validators.required),
  });
  uploadSelectOption: UploadFormSelectType[] = [
    {
      value: ProofType.PROOF_OF_FREEDOM,
      key: 'Proof of freedom',
    },
    {
      value: ProofType.PROOF_OF_OWNERSHIP,
      key: 'Proof of ownership',
    },
  ];

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private plotOfLandService: PlotOfLandService,
    private cultivationService: CultivationService,
    private generatePlotOfLandService: GeneratePlotOfLandService
  ) {
    this.farmers$ = this.companyService.getFarmersByCompanyId('id');
    this.users$ = this.userService.getUsers();
    this.coffeeOptions$ = this.cultivationService.readCultivationsByType('coffee');
  }

  submitPlotOfLand(): void {
    if (this.plotOfLandFormGroup.valid) {
      this.plotOfLandService
        .createPlotOfLand(FARMER_ID, this.generatePlotOfLandService.createNewPlotOfLand(this.plotOfLandFormGroup))
        .pipe()
        .subscribe(() => {
          this.clearInputFields();
          toast.success(Messages.successPlotOfLand);
          this.uploadSelectOption.forEach((option) => {
            option.file = undefined;
          });
        });
    } else {
      this.plotOfLandFormGroup.markAllAsTouched();
    }
  }

  clearInputFields(): void {
    this.plotOfLandFormGroup.reset();
  }

  submitFile({ file, documentType }: { file: File; documentType: string }): void {
    const option = this.uploadSelectOption.find((option) => option.value === documentType);

    if (!option) return;
    option.file = file;
  }
}
