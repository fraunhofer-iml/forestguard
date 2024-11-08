import {
  CoordinateType,
  CultivationDto,
  FGFile,
  PlotOfLandDto,
  ProofDto,
  ProofType,
  Standard,
  UserDto,
  UserOrFarmerDto,
} from '@forest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { combineLatest, mergeMap, Observable, tap } from 'rxjs';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { UploadFormSelectType } from '../../../shared/components/upload-form/upload-form-select.type';
import { Messages } from '../../../shared/messages';
import { CompanyService } from '../../../shared/services/company/company.service';
import { CultivationService } from '../../../shared/services/cultivation/cultivation.service';
import { PlotOfLandService } from '../../../shared/services/plotOfLand/plotOfLand.service';
import { UserService } from '../../../shared/services/user/user.service';
import { JsonData } from './model/json-data';
import { PlotOfLandForm } from './model/plot-of-land-form';
import { GeneratePlotOfLandService } from './service/generate-plot-of-land.service';

@Component({
  selector: 'app-add-pol',
  templateUrl: './add-plot-of-land.component.html',
})
export class AddPlotOfLandComponent {
  isImportGeoDataVisible = false;
  valueChangesOfGeoDataStandard$: Observable<string | null> | undefined;
  users$: Observable<UserDto[]>;
  farmers$: Observable<UserOrFarmerDto[]>;
  coffeeOptions$: Observable<CultivationDto[]>;
  plotOfLandFormGroup: FormGroup<PlotOfLandForm> = new FormGroup<PlotOfLandForm>({
    processOwner: new FormControl(null, Validators.required),
    region: new FormControl(null, Validators.required),
    plotOfLand: new FormControl(null, Validators.required),
    cultivationSort: new FormControl(null, Validators.required),
    cultivationQuality: new FormControl(null),
    localPlotOfLandId: new FormControl(null, Validators.required),
    nationalPlotOfLandId: new FormControl(null, Validators.required),
    geoDataInput: new FormControl(null),
    geoDataStandard: new FormControl(null, Validators.required),
    geoDataZone: new FormControl({ value: null, disabled: true }),
    geoDataType: new FormControl(null, Validators.required),
    geoDataCoordinate: new FormControl(null, Validators.required),
  });
  uploadSelectOption: UploadFormSelectType[] = [
    {
      value: ProofType.PROOF_OF_FREEDOM,
      key: 'Proof of freedom from deforestation',
    },
    {
      value: ProofType.PROOF_OF_OWNERSHIP,
      key: 'Proof of ownership',
    },
  ];

  getGeoDataStandards() {
    return Object.values(Standard);
  }

  getGeoDataCoordinateTypes() {
    return Object.values(CoordinateType);
  }

  constructor(
    private readonly companyService: CompanyService,
    private readonly userService: UserService,
    private readonly plotOfLandService: PlotOfLandService,
    private readonly cultivationService: CultivationService,
    private readonly generatePlotOfLandService: GeneratePlotOfLandService,
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router
  ) {
    this.farmers$ = this.companyService.getFarmersByCompanyId(this.authenticationService.getCurrentCompanyId() ?? '');
    this.users$ = this.userService.getUsers();
    this.coffeeOptions$ = this.cultivationService.readCultivationsByCommodity('coffee');
    this.enableFieldsByValueChange();
  }

  toggleImportGeoData() {
    this.isImportGeoDataVisible = !this.isImportGeoDataVisible;
  }

  submitPlotOfLand(): void {
    let plotOfLandId: string;
    if (this.plotOfLandFormGroup.valid && this.plotOfLandFormGroup.value.processOwner) {
      this.plotOfLandService
        .createPlotOfLand(
          this.plotOfLandFormGroup.value.processOwner,
          this.generatePlotOfLandService.createNewPlotOfLand(this.plotOfLandFormGroup)
        )
        .pipe(
          mergeMap((plotOfLand: PlotOfLandDto) => {
            const createProofsObservables: Observable<ProofDto>[] = [];
            plotOfLandId = plotOfLand.id;
            this.uploadSelectOption.forEach((option) => {
              if (option.file) {
                const formData = new FormData();
                formData.append('file', option.file);
                formData.append('type', option.value);
                createProofsObservables.push(this.plotOfLandService.createProof(plotOfLand.id, formData));
              }
            });
            this.router.navigate(['/pols', plotOfLand.id]);
            return combineLatest(createProofsObservables);
          })
        )
        .subscribe(() => {
          this.uploadSelectOption.forEach((option) => {
            option.file = undefined;
            this.router.navigate(['/pols', plotOfLandId]);
            location.reload();
          });
        });
    } else {
      this.plotOfLandFormGroup.markAllAsTouched();
    }
  }

  clearInputFields(): void {
    this.plotOfLandFormGroup.reset();
  }

  submitFile({ file, documentType }: FGFile): void {
    const option = this.uploadSelectOption.find((option) => option.value === documentType);

    if (!option) return;
    option.file = file;
  }

  saveGeoData(): void {
    let jsonData: JsonData;

    try {
      jsonData = JSON.parse(this.plotOfLandFormGroup.get('geoDataInput')?.value ?? '');
    } catch (error) {
      toast.error(Messages.invalidGeoData);
      return;
    }

    if (Array.isArray(jsonData?.geometry?.coordinates?.[0])) {
      this.plotOfLandFormGroup.patchValue({
        geoDataStandard: Standard.WGS,
        geoDataCoordinate: JSON.stringify(jsonData.geometry.coordinates[0]),
        geoDataType: jsonData.geometry.type,
      });
      this.isImportGeoDataVisible = false;
    } else {
      toast.error(Messages.invalidGeoData);
    }
  }

  private enableFieldsByValueChange(): void {
    this.valueChangesOfGeoDataStandard$ = this.plotOfLandFormGroup.controls.geoDataStandard.valueChanges.pipe(
      tap((geoDataStandard) => {
        if (geoDataStandard === 'UTM') {
          this.plotOfLandFormGroup.get('geoDataZone')?.enable();
        } else {
          this.plotOfLandFormGroup.get('geoDataZone')?.disable();
        }
      })
    );
  }
}
