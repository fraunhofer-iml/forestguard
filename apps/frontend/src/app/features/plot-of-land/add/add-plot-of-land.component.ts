/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CoordinateType,
  FGFile,
  PlotOfLandDto,
  ProofDto,
  ProofType,
  Standard,
  UserDto,
  UserOrFarmerDto,
} from '@forest-guard/api-interfaces';
import { convertToCorrectFormat, convertUTMtoWGS, CoordinateInput } from '@forest-guard/utm';
import { Icon, LatLng, latLng, Layer, marker, polygon, tileLayer } from 'leaflet';
import { toast } from 'ngx-sonner';
import { combineLatest, filter, map, mergeMap, Observable, startWith, switchMap, tap } from 'rxjs';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { UploadFormSelectType } from '../../../shared/components/upload-form/upload-form-select.type';
import { Messages } from '../../../shared/messages';
import { CompanyService } from '../../../shared/services/company/company.service';
import { CultivationService } from '../../../shared/services/cultivation/cultivation.service';
import { PlotOfLandService } from '../../../shared/services/plotOfLand/plotOfLand.service';
import { UserService } from '../../../shared/services/user/user.service';
import { getFormattedUserName } from '../../../shared/utils/user-company-utils';
import { JsonData } from './model/json-data';
import { PlotOfLandForm } from './model/plot-of-land-form';
import { GeneratePlotOfLandService } from './service/generate-plot-of-land.service';

@Component({
  selector: 'app-add-pol',
  templateUrl: './add-plot-of-land.component.html',
})
export class AddPlotOfLandComponent {
  isImportGeoDataVisible = false;
  users$: Observable<UserDto[]>;
  farmers$: Observable<UserOrFarmerDto[]>;
  coffeeOptions$?: Observable<string[]>;
  qualityOptions$: Observable<string[]>;

  plotOfLandFormGroup: FormGroup<PlotOfLandForm> = new FormGroup<PlotOfLandForm>({
    processOwner: new FormControl('', Validators.required),
    region: new FormControl(null, Validators.required),
    plotOfLand: new FormControl(null, Validators.required),
    cultivationSort: new FormControl(null, Validators.required),
    cultivationQuality: new FormControl({ value: null, disabled: true }),
    localPlotOfLandId: new FormControl(null, Validators.required),
    nationalPlotOfLandId: new FormControl(null, Validators.required),
  });

  geoDataFormGroup: FormGroup = new FormGroup({
    geoDataInput: new FormControl(null),
    geoDataStandard: new FormControl(null, Validators.required),
    geoDataZone: new FormControl(null),
    geoDataType: new FormControl(null, Validators.required),
    geoDataCoordinates: new FormArray([new FormArray([])]),
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

  center: LatLng = latLng(51.514, 7.468);
  layers: Layer[] = [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 })];
  protected readonly getFormattedUserName = getFormattedUserName;

  get geoDataStandard() {
    return this.geoDataFormGroup?.get('geoDataStandard')?.value as Standard;
  }

  get geoDataType() {
    return this.geoDataFormGroup?.get('geoDataType')?.value as CoordinateType;
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
    this.farmers$ = this.companyService.getFarmersByCompanyId(this.authenticationService.getCurrentCompanyId() ?? '').pipe(
      switchMap((farmers) => {
        return this.plotOfLandFormGroup.controls.processOwner.valueChanges.pipe(
          startWith(''),
          map((value) =>
            farmers.filter((farmer) => {
              if (!value || value instanceof Object) return farmer;

              return (
                farmer.firstName.toLowerCase().includes((value as string).toLowerCase()) ||
                farmer.lastName.toLowerCase().includes((value as string).toLowerCase())
              );
            })
          )
        );
      })
    );
    this.users$ = this.userService.getUsers();
    this.coffeeOptions$ = this.cultivationService.getSorts();
    this.qualityOptions$ = this.plotOfLandFormGroup.controls.cultivationSort.valueChanges.pipe(
      tap((sort) => {
        if (!sort) {
          this.plotOfLandFormGroup.controls.cultivationQuality.disable();
        }
        this.plotOfLandFormGroup.controls.cultivationQuality.setValue(null);
      }),
      filter((sort): sort is string => !!sort),
      switchMap((sort) =>
        this.cultivationService.getQualities(sort).pipe(
          map((qualities) => {
            this.plotOfLandFormGroup.controls.cultivationQuality.enable();
            return qualities;
          })
        )
      )
    );
    this.handleGeoDataValueChange();
  }

  toggleImportGeoData() {
    this.isImportGeoDataVisible = !this.isImportGeoDataVisible;
  }

  submitPlotOfLand(): void {
    let plotOfLandId: string;
    if (this.plotOfLandFormGroup.valid && this.geoDataFormGroup.valid && this.plotOfLandFormGroup.value.processOwner) {
      const formData = this.geoDataFormGroup.get('geoDataCoordinates')?.value as CoordinateInput;

      if (typeof this.plotOfLandFormGroup.value.processOwner === 'string') {
        this.plotOfLandFormGroup.controls.processOwner.setErrors({
          noUserSelected: true,
        });
        this.plotOfLandFormGroup.markAllAsTouched();
        return;
      }

      const convertedCoordinates =
        this.geoDataStandard === Standard.UTM ? convertUTMtoWGS(formData, this.geoDataFormGroup.get('geoDataZone')?.value) : formData;
      const coordinates = convertToCorrectFormat(convertedCoordinates, this.geoDataType);
      if (this.geoDataStandard === Standard.UTM) {
        this.geoDataFormGroup.value.geoDataStandard = Standard.WGS;
      }

      this.plotOfLandService
        .createPlotOfLand(
          (this.plotOfLandFormGroup.value.processOwner as UserOrFarmerDto).id,
          this.generatePlotOfLandService.createNewPlotOfLand(this.plotOfLandFormGroup, this.geoDataFormGroup, coordinates)
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
    this.uploadSelectOption.forEach((option: UploadFormSelectType) => (option.file = undefined));
  }

  submitFile({ file, documentType }: FGFile): void {
    const option = this.uploadSelectOption.find((option) => option.value === documentType);

    if (!option) return;
    option.file = file;
  }

  removeFile(upload: UploadFormSelectType): void {
    this.uploadSelectOption = this.uploadSelectOption.map((uploadedFile: UploadFormSelectType) =>
      uploadedFile.key === upload.key ? { ...uploadedFile, file: undefined } : uploadedFile
    );
  }

  // #FOR-518 (https://oe160.iml.fraunhofer.de/jira/browse/FOR-518)
  saveGeoData(): void {
    let jsonData: JsonData;

    try {
      jsonData = JSON.parse(this.geoDataFormGroup.get('geoDataInput')?.value || '');
    } catch (error) {
      toast.error(Messages.invalidGeoData);
      return;
    }

    if (jsonData?.geometry?.coordinates) {
      this.geoDataFormGroup.patchValue({
        geoDataStandard: Standard.WGS,
        geoDataCoordinates: jsonData.geometry.coordinates,
        geoDataType: jsonData.geometry.type,
      });
      this.isImportGeoDataVisible = false;
    } else {
      toast.error(Messages.invalidGeoData);
    }
  }

  private handleGeoDataValueChange(): void {
    this.geoDataFormGroup.valueChanges.subscribe((values) => {
      if (this.geoDataFormGroup.invalid) return;

      const selectedStandard = values['geoDataStandard'] as Standard;
      const selectedType = values['geoDataType'] as CoordinateType;

      const convertedCoordinates =
        selectedStandard === Standard.UTM
          ? convertUTMtoWGS(values['geoDataCoordinates'], values['geoDataZone'])
          : values['geoDataCoordinates'];

      if (convertedCoordinates && convertedCoordinates[0] && convertedCoordinates[0][0]) {
        this.center = latLng(convertedCoordinates[0][0]['x'] || 0, convertedCoordinates[0][0]['y'] || 0);
      } else {
        this.center = latLng(51.514, 7.468);
      }

      if (convertedCoordinates && (selectedType === CoordinateType.Point || selectedType === CoordinateType.MultiPoint)) {
        this.updateMarkers(convertedCoordinates);
      } else if (convertedCoordinates && (selectedType === CoordinateType.Polygon || selectedType === CoordinateType.MultiPolygon)) {
        this.updatePolygons(convertedCoordinates);
      }
    });
  }

  updateMarkers(coordinates: CoordinateInput): void {
    if (!coordinates || coordinates.length === 0) return;
    const markers = coordinates[0].map((coordinate: { x: number; y: number }) => {
      return marker([coordinate.x || 0, coordinate.y || 0], { icon: new Icon.Default({ imagePath: './media/' }) });
    });

    this.layers = [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }), ...markers];
  }

  updatePolygons(coordinates: CoordinateInput): void {
    if (!coordinates || coordinates.length === 0) return;
    const polygons = coordinates.map((coordinate) => {
      return polygon(coordinate.map((point: { x: number; y: number }) => [point.x || 0, point.y || 0]));
    });

    this.layers = [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }), ...polygons];
  }
}
