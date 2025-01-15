/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoordinateType, Standard } from '@forest-guard/api-interfaces';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CoordinateInputComponent } from './coordinate-input.component';

describe('CoordinateInputComponent', () => {
  let component: CoordinateInputComponent;
  let fixture: ComponentFixture<CoordinateInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoordinateInputComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CoordinateInputComponent);
    component = fixture.componentInstance;
    component.geoDataFormGroup = new FormGroup({
      geoDataStandard: new FormControl(Standard.UTM),
      geoDataZone: new FormControl({ value: '', disabled: true }),
      geoDataType: new FormControl(CoordinateType.Point),
      geoDataCoordinates: new FormArray([new FormArray([])]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable geoDataZone when geoDataStandard is UTM', () => {
    component.geoDataFormGroup?.get('geoDataStandard')?.setValue(Standard.UTM);
    fixture.detectChanges();
    expect(component.geoDataFormGroup?.get('geoDataZone')?.enabled).toEqual(true);
  });

  it('should disable geoDataZone when geoDataStandard is not UTM', () => {
    component.geoDataFormGroup?.get('geoDataStandard')?.setValue(Standard.WGS);
    fixture.detectChanges();
    expect(component.geoDataFormGroup?.get('geoDataZone')?.disabled).toBe(true);
  });

  it('should call startWithPoint when geoDataType is Point', () => {
    jest.spyOn(component, 'startWithPoint');
    component.geoDataFormGroup?.get('geoDataType')?.setValue(CoordinateType.Point);
    fixture.detectChanges();
    expect(component.startWithPoint).toHaveBeenCalled();
  });

  it('should call startWithMultiPoint when geoDataType is MultiPoint', () => {
    jest.spyOn(component, 'startWithMultiPoint');
    component.geoDataFormGroup?.get('geoDataType')?.setValue(CoordinateType.MultiPoint);
    fixture.detectChanges();
    expect(component.startWithMultiPoint).toHaveBeenCalled();
  });

  it('should call startWithPolygon when geoDataType is Polygon', () => {
    jest.spyOn(component, 'startWithPolygon');
    component.geoDataFormGroup?.get('geoDataType')?.setValue(CoordinateType.Polygon);
    fixture.detectChanges();
    expect(component.startWithPolygon).toHaveBeenCalled();
  });

  it('should call startWithMultiPolygon when geoDataType is MultiPolygon', () => {
    jest.spyOn(component, 'startWithMultiPolygon');
    component.geoDataFormGroup?.get('geoDataType')?.setValue(CoordinateType.MultiPolygon);
    fixture.detectChanges();
    expect(component.startWithMultiPolygon).toHaveBeenCalled();
  });

  it('should add coordinates with correct validators for UTM standard', () => {
    component.geoDataFormGroup?.get('geoDataStandard')?.setValue(Standard.UTM);
    component.addCoordinate(0);
    const coordinateGroup = component.getCoordinates(0).at(0) as FormGroup;
    expect(coordinateGroup.get('x')?.validator).toBeTruthy();
    expect(coordinateGroup.get('y')?.validator).toBeTruthy();
  });

  it('should add coordinates with correct validators for WGS84 standard', () => {
    component.geoDataFormGroup?.get('geoDataStandard')?.setValue(Standard.WGS);
    component.addCoordinate(0);
    const coordinateGroup = component.getCoordinates(0).at(0) as FormGroup;
    expect(coordinateGroup.get('x')?.validator).toBeTruthy();
    expect(coordinateGroup.get('y')?.validator).toBeTruthy();
  });

  it('should sync last coordinate with first for Polygon type', () => {
    component.geoDataFormGroup?.get('geoDataType')?.setValue(CoordinateType.Polygon);
    component.addPolygon(3);
    const firstCoordinate = component.getCoordinates(0).at(0) as FormGroup;
    const lastCoordinate = component.getCoordinates(0).at(2) as FormGroup;
    firstCoordinate.get('x')?.setValue(10);
    firstCoordinate.get('y')?.setValue(20);
    expect(lastCoordinate.get('x')?.value).toBe(10);
    expect(lastCoordinate.get('y')?.value).toBe(20);
  });
});
