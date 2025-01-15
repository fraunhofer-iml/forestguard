/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlotOfLandDto, ProofDto, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import * as L from 'leaflet';
import { toast } from 'ngx-sonner';
import { of, take, tap } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { provideRouter, Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { UploadFormSelectType } from '../../../shared/components/upload-form/upload-form-select.type';
import { Messages } from '../../../shared/messages';
import { CompanyService } from '../../../shared/services/company/company.service';
import { CultivationService } from '../../../shared/services/cultivation/cultivation.service';
import { PlotOfLandService } from '../../../shared/services/plotOfLand/plotOfLand.service';
import { UserService } from '../../../shared/services/user/user.service';
import { AddPlotOfLandComponent } from './add-plot-of-land.component';
import { GeneratePlotOfLandService } from './service/generate-plot-of-land.service';

jest.mock('ngx-sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('AddPlotOfLandComponent', () => {
  let component: AddPlotOfLandComponent;
  let fixture: ComponentFixture<AddPlotOfLandComponent>;
  let plotOfLandService: PlotOfLandService;
  let router: Router;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  beforeEach(async () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...window.location,
        reload: jest.fn(),
      },
    });

    await TestBed.configureTestingModule({
      declarations: [AddPlotOfLandComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [MatAutocompleteModule],
      providers: [
        PlotOfLandService,
        CompanyService,
        HttpClient,
        HttpHandler,
        FormBuilder,
        UserService,
        CultivationService,
        provideRouter([]),
        GeneratePlotOfLandService,
        {
          provide: AuthenticationService,
          useValue: {
            getCurrentCompanyId: jest.fn().mockReturnValue(''),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPlotOfLandComponent);
    plotOfLandService = TestBed.inject(PlotOfLandService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
    formBuilder = TestBed.inject(FormBuilder);
    formGroup = formBuilder.group({
      polygondataZone: [{ value: '', disabled: false }],
      polygondataType: [{ value: '', disabled: false }],
      polygondataCoordinate: [{ value: '', disabled: false }],
      polygondataStandard: [''],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required controls', () => {
    expect(component.plotOfLandFormGroup.contains('processOwner')).toBeTruthy();
    expect(component.plotOfLandFormGroup.contains('region')).toBeTruthy();
    expect(component.plotOfLandFormGroup.contains('plotOfLand')).toBeTruthy();
    expect(component.plotOfLandFormGroup.contains('cultivationSort')).toBeTruthy();
    expect(component.plotOfLandFormGroup.contains('localPlotOfLandId')).toBeTruthy();
    expect(component.plotOfLandFormGroup.contains('nationalPlotOfLandId')).toBeTruthy();
    expect(component.geoDataFormGroup.contains('geoDataInput')).toBeTruthy();
    expect(component.geoDataFormGroup.contains('geoDataStandard')).toBeTruthy();
  });

  it('should have form invalid when empty', () => {
    expect(component.plotOfLandFormGroup.valid).toBeFalsy();
  });

  it('should mark all controls as touched', () => {
    component.submitPlotOfLand();

    Object.keys(component.plotOfLandFormGroup.controls).forEach((key) => {
      const control = component.plotOfLandFormGroup.get(key);
      expect(control?.touched).toBeTruthy();
    });
  });

  it('should clear input fields', () => {
    component.clearInputFields();

    expect(component.plotOfLandFormGroup.pristine).toBe(true);
    expect(component.plotOfLandFormGroup.untouched).toBe(true);
  });

  it('should handle file upload correctly', () => {
    const file = new File([], 'test.pdf');
    component.submitFile({ file, documentType: 'PROOF_OF_OWNERSHIP' });
    expect(component.uploadSelectOption.find((option) => option.value === 'PROOF_OF_OWNERSHIP')?.file).toBe(file);
  });

  it('should enable specific fields based on value change to "UTM"', () => {
    (component as any).handleGeoDataValueChange(formGroup);

    formGroup.get('polygondataStandard')?.setValue('UTM');
    formGroup
      .get('polygondataStandard')
      ?.valueChanges.pipe(
        take(1),
        tap(() => {
          expect(formGroup.get('polygondataZone')?.enabled).toBe(true);
          expect(formGroup.get('polygondataType')?.enabled).toBe(true);
          expect(formGroup.get('polygondataCoordinate')?.enabled).toBe(true);
        })
      )
      .subscribe();
  });

  it('should parse valid geoDataInput and update form values', () => {
    component.geoDataFormGroup.get('geoDataInput')?.setValue(
      JSON.stringify({
        geometry: {
          coordinates: [[1, 2]],
          type: 'MultiPoint',
        },
      })
    );
    component.saveGeoData();

    expect(component.geoDataFormGroup.get('geoDataStandard')?.value).toBe('WGS');
    expect(component.geoDataFormGroup.get('geoDataCoordinates')?.value).toEqual([[]]);
    expect(component.geoDataFormGroup.get('geoDataType')?.value).toBe('MultiPoint');
    expect(component.isImportGeoDataVisible).toBe(false);
  });

  it('should toggle openImportGeoData from true to false', () => {
    component.isImportGeoDataVisible = true;
    component.toggleImportGeoData();

    expect(component.isImportGeoDataVisible).toBe(false);
  });

  it('should show error toast when geoData is invalid JSON', () => {
    const invalidJson = 'invalid json';
    component.geoDataFormGroup.get('geoDataInput')?.setValue(invalidJson);
    component.saveGeoData();

    expect(toast.error).toHaveBeenCalledWith(Messages.invalidGeoData);
  });

  it('should update polygons correctly', () => {
    const coordinates = [
      [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ],
    ];
    component.updatePolygons(coordinates);

    expect(component.layers.length).toBe(2); // One for tileLayer and one for polygon
    const polygonLayer = component.layers[1];
    expect(polygonLayer instanceof L.Polygon).toBe(true);
    const latLngs = (polygonLayer as L.Polygon).getLatLngs() as L.LatLng[][];
    expect(latLngs[0][0].lat).toBe(1);
    expect(latLngs[0][0].lng).toBe(2);
    expect(latLngs[0][1].lat).toBe(3);
    expect(latLngs[0][1].lng).toBe(4);
  });

  it('should not update polygons if coordinates are empty', () => {
    component.updatePolygons([]);

    expect(component.layers.length).toBe(1); // Only the tileLayer should be present
  });

  it('should update markers correctly', () => {
    const coordinates = [
      [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ],
    ];
    component.updateMarkers(coordinates);

    expect(component.layers.length).toBe(3); // One for tileLayer and two for markers
    const markerLayer1 = component.layers[1];
    const markerLayer2 = component.layers[2];
    expect(markerLayer1 instanceof L.Marker).toBe(true);
    expect(markerLayer2 instanceof L.Marker).toBe(true);
    const latLng1 = (markerLayer1 as L.Marker).getLatLng();
    const latLng2 = (markerLayer2 as L.Marker).getLatLng();
    expect(latLng1.lat).toBe(1);
    expect(latLng1.lng).toBe(2);
    expect(latLng2.lat).toBe(3);
    expect(latLng2.lng).toBe(4);
  });

  it('should not update markers if coordinates are empty', () => {
    component.updateMarkers([]);

    expect(component.layers.length).toBe(1); // Only the tileLayer should be present
  });

  it('should enable specific fields based on value change to "UTM"', () => {
    formGroup.get('polygondataStandard')?.setValue('UTM');
    formGroup
      .get('polygondataStandard')
      ?.valueChanges.pipe(
        take(1),
        tap(() => {
          expect(formGroup.get('polygondataZone')?.enabled).toBe(true);
          expect(formGroup.get('polygondataType')?.enabled).toBe(true);
          expect(formGroup.get('polygondataCoordinate')?.enabled).toBe(true);
        })
      )
      .subscribe();
  });

  it('should update center coordinates based on geoDataCoordinates', () => {
    component.geoDataFormGroup.patchValue({
      geoDataStandard: 'WGS',
      geoDataType: 'Point',
    });

    const fa = component.geoDataFormGroup.get('geoDataCoordinates') as FormArray;
    const fa2 = fa.at(0) as FormArray;
    fa2.push(formBuilder.group({ x: 10, y: 20 }));
    fa2.push(formBuilder.group({ x: 30, y: 40 }));

    expect(component.center.lat).toBe(10);
    expect(component.center.lng).toBe(20);
  });

  it('should update markers when geoDataType is "Point"', () => {
    component.geoDataFormGroup.patchValue({
      geoDataStandard: 'WGS',
      geoDataType: 'Point',
    });

    const fa = component.geoDataFormGroup.get('geoDataCoordinates') as FormArray;
    const fa2 = fa.at(0) as FormArray;
    fa2.push(formBuilder.group({ x: 10, y: 20 }));
    fa2.push(formBuilder.group({ x: 30, y: 40 }));

    expect(component.layers.length).toBe(3); // One for tileLayer and two for markers
    const markerLayer1 = component.layers[1];
    const markerLayer2 = component.layers[2];
    expect(markerLayer1 instanceof L.Marker).toBe(true);
    expect(markerLayer2 instanceof L.Marker).toBe(true);
    const latLng1 = (markerLayer1 as L.Marker).getLatLng();
    const latLng2 = (markerLayer2 as L.Marker).getLatLng();
    expect(latLng1.lat).toBe(10);
    expect(latLng1.lng).toBe(20);
    expect(latLng2.lat).toBe(30);
    expect(latLng2.lng).toBe(40);
  });

  it('should update polygons when geoDataType is "Polygon"', () => {
    component.geoDataFormGroup.patchValue({
      geoDataStandard: 'WGS',
      geoDataType: 'Polygon',
    });

    const fa = component.geoDataFormGroup.get('geoDataCoordinates') as FormArray;
    const fa2 = fa.at(0) as FormArray;
    fa2.push(formBuilder.group({ x: 10, y: 20 }));
    fa2.push(formBuilder.group({ x: 30, y: 40 }));

    expect(component.layers.length).toBe(2); // One for tileLayer and one for polygon
    const polygonLayer = component.layers[1];
    expect(polygonLayer instanceof L.Polygon).toBe(true);
    const latLngs = (polygonLayer as L.Polygon).getLatLngs() as L.LatLng[][];
    expect(latLngs[0][0].lat).toBe(10);
    expect(latLngs[0][0].lng).toBe(20);
    expect(latLngs[0][1].lat).toBe(30);
    expect(latLngs[0][1].lng).toBe(40);
  });

  it('should not update center coordinates if geoDataCoordinates are empty', () => {
    component.geoDataFormGroup.patchValue({
      geoDataStandard: 'WGS',
      geoDataCoordinates: [],
      geoDataType: 'Point',
    });

    expect(component.center.lat).toBe(51.514);
    expect(component.center.lng).toBe(7.468);
  });

  it('should call createPlotOfLand and navigate to the plot of land page when form is valid', () => {
    const plotOfLandId = '123';
    const plotOfLandDto = { id: plotOfLandId } as PlotOfLandDto;
    const createPlotOfLandSpy = jest.spyOn(plotOfLandService, 'createPlotOfLand').mockReturnValue(of(plotOfLandDto));
    const createProofSpy = jest.spyOn(plotOfLandService, 'createProof').mockReturnValue(of({} as ProofDto));
    const navigateSpy = jest.spyOn(router, 'navigate');
    const markAllAsTouchedSpy = jest.spyOn(component.plotOfLandFormGroup, 'markAllAsTouched');

    component.plotOfLandFormGroup.setValue({
      processOwner: { id: 'owner' } as UserOrFarmerDto,
      region: 'region',
      plotOfLand: 'plot',
      cultivationSort: 'sort',
      cultivationQuality: null,
      localPlotOfLandId: 'localId',
      nationalPlotOfLandId: 'nationalId',
    });

    component.uploadSelectOption[0].file = new File([], 'test.pdf');

    component.geoDataFormGroup.setValue({
      geoDataInput: null,
      geoDataStandard: 'WGS',
      geoDataZone: null,
      geoDataType: 'Point',
      geoDataCoordinates: [[]],
    });

    component.submitPlotOfLand();

    expect(createPlotOfLandSpy).toHaveBeenCalled();
    expect(createProofSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/pols', plotOfLandId]);
    expect(markAllAsTouchedSpy).not.toHaveBeenCalled();
  });

  it('should mark all controls as touched when form is invalid', () => {
    const markAllAsTouchedSpy = jest.spyOn(component.plotOfLandFormGroup, 'markAllAsTouched');

    component.submitPlotOfLand();

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('should not call createPlotOfLand when form is invalid', () => {
    const createPlotOfLandSpy = jest.spyOn(plotOfLandService, 'createPlotOfLand');

    component.submitPlotOfLand();

    expect(createPlotOfLandSpy).not.toHaveBeenCalled();
  });

  it('should handle file uploads correctly', () => {
    const plotOfLandId = '123';
    const plotOfLandDto = { id: plotOfLandId } as PlotOfLandDto;
    const createPlotOfLandSpy = jest.spyOn(plotOfLandService, 'createPlotOfLand').mockReturnValue(of(plotOfLandDto));
    const createProofSpy = jest.spyOn(plotOfLandService, 'createProof').mockReturnValue(of({} as ProofDto));
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.plotOfLandFormGroup.setValue({
      processOwner: { id: 'owner' } as UserOrFarmerDto,
      region: 'region',
      plotOfLand: 'plot',
      cultivationSort: 'sort',
      cultivationQuality: null,
      localPlotOfLandId: 'localId',
      nationalPlotOfLandId: 'nationalId',
    });

    component.geoDataFormGroup.setValue({
      geoDataInput: null,
      geoDataStandard: 'WGS',
      geoDataZone: null,
      geoDataType: 'Point',
      geoDataCoordinates: [[]],
    });

    component.uploadSelectOption[0].file = new File([], 'test.pdf');

    component.submitPlotOfLand();

    expect(createPlotOfLandSpy).toHaveBeenCalled();
    expect(createProofSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/pols', plotOfLandId]);
  });

  it('should remove the file from the matching upload', () => {
    const upload1: UploadFormSelectType = { key: 'file1', value: 'Proof of Freedom', file: new File([], 'proofOfFreedom.pdf') };
    const upload2: UploadFormSelectType = { key: 'file2', value: 'Proof of ownership', file: new File([], 'proofOfOwnership.pdf') };
    component.uploadSelectOption = [upload1, upload2];
    component.removeFile({ key: 'file1', value: 'Proof of Freedom' });

    expect(component.uploadSelectOption).toEqual([
      {
        key: 'file1',
        value: 'Proof of Freedom',
        file: undefined,
      },
      {
        file: new File([], 'proofOfOwnership.pdf'),
        key: 'file2',
        value: 'Proof of ownership',
      },
    ]);
  });
});
