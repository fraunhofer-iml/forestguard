/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoordinateType, Standard } from '@forest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { Subject, takeUntil, tap } from 'rxjs';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-coordinate-input',
  templateUrl: './coordinate-input.component.html',
})
export class CoordinateInputComponent implements AfterViewInit {
  @Input() geoDataFormGroup: FormGroup | undefined;
  @Output() save = new EventEmitter<void>();
  private readonly endSubscription = new Subject<void>();

  CoordinateType = CoordinateType;
  Standard = Standard;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (!this.geoDataFormGroup) return;

    this.geoDataFormGroup.get('geoDataStandard')?.valueChanges.subscribe((value) => {
      if (value === Standard.UTM) {
        this.geoDataFormGroup?.get('geoDataZone')?.enable();
        this.geoDataFormGroup?.get('geoDataZone')?.setValidators([Validators.required, Validators.min(1), Validators.max(60)]);
      } else {
        this.geoDataFormGroup?.get('geoDataZone')?.disable();
        this.geoDataFormGroup?.get('geoDataZone')?.clearValidators();
      }

      this.geoDataFormGroup?.patchValue({ geoDataType: CoordinateType.Point });
    });

    this.geoDataFormGroup.get('geoDataType')?.valueChanges.subscribe((value) => {
      switch (value) {
        case CoordinateType.Point:
          this.startWithPoint();
          break;
        case CoordinateType.MultiPoint:
          this.startWithMultiPoint();
          break;
        case CoordinateType.Polygon:
          this.startWithPolygon();
          break;
        case CoordinateType.MultiPolygon:
          this.startWithMultiPolygon();
          break;
      }
    });
  }

  getGeoDataStandards() {
    return Object.values(Standard);
  }

  getGeoDataCoordinateTypes() {
    return Object.values(CoordinateType);
  }

  get geoDataType() {
    return this.geoDataFormGroup?.get('geoDataType')?.value;
  }

  get geoDataStandard() {
    return this.geoDataFormGroup?.get('geoDataStandard')?.value;
  }

  getPolygons() {
    return this.geoDataFormGroup?.get('geoDataCoordinates') as FormArray;
  }

  getCoordinates(index = 0): FormArray {
    return (this.geoDataFormGroup?.get('geoDataCoordinates') as FormArray).at(index) as FormArray;
  }

  startWithPoint() {
    this.clearAll();
    this.addPolygons({ amount: 1, numberOfPoints: 1 });
  }

  startWithMultiPoint() {
    this.clearAll();
    this.addPolygons({ amount: 1, numberOfPoints: 2 });
  }

  startWithPolygon() {
    this.clearAll();
    this.addPolygons({ amount: 1, numberOfPoints: 3 });
  }

  startWithMultiPolygon() {
    this.clearAll();
    this.addPolygons({ amount: 2, numberOfPoints: 3 });
  }

  addCoordinates(amount: number, index = 0) {
    for (let i = 0; i < amount; i++) {
      this.addCoordinate(index);
    }
  }

  private clearAll() {
    this.getPolygons().clear();
    this.cdr.detectChanges();
  }

  addCoordinate(index: number, position: 'middle' | 'end' = 'end') {
    const coordinateGroup = new FormGroup({
      x: new FormControl<number | null>(null, Validators.required),
      y: new FormControl<number | null>(null, Validators.required),
    });

    if (this.geoDataStandard === Standard.UTM) {
      coordinateGroup.get('x')?.setValidators([Validators.required, Validators.min(160000), Validators.max(840000)]);
      coordinateGroup.get('y')?.setValidators([Validators.required, Validators.min(0), Validators.max(10000000)]);
    } else {
      coordinateGroup.get('x')?.setValidators([Validators.required, Validators.min(-180), Validators.max(180)]);
      coordinateGroup.get('y')?.setValidators([Validators.required, Validators.min(-90), Validators.max(90)]);
    }

    const currentPolygon = this.getCoordinates(index);
    currentPolygon.push(coordinateGroup);

    if (position === 'middle') {
      currentPolygon.at(currentPolygon.length - 2).reset();
    }

    this.syncLastCoordinateWithFirst();
  }

  addPolygon(numberOfPoints: number) {
    const polygon = new FormArray([]);
    this.getPolygons().push(polygon);
    this.addCoordinates(numberOfPoints, this.getPolygons().length - 1);
  }

  addPolygons({ amount, numberOfPoints }: { amount: number; numberOfPoints: number }) {
    for (let i = 0; i < amount; i++) {
      this.addPolygon(numberOfPoints);
    }
  }

  removePolygon(index: number) {
    if (this.getPolygons().length <= 2) {
      toast.info('At least two polygons are required', {
        description: 'For a multipolygon, two polygons are required. If you need to input only one polygon, please select the polygon type',
      });

      return;
    }

    this.getPolygons().removeAt(index);
  }

  removeCoordinate(pindex: number, cindex: number) {
    if (this.geoDataType === CoordinateType.MultiPoint) {
      if (this.getCoordinates(pindex).length <= 2) {
        toast.info('At least two points are required', {
          description: 'For a multipoint, two points are required. If you need to input only one point, please select the point type',
        });
        return;
      }
    }

    if (this.geoDataType === CoordinateType.Polygon) {
      if (this.getCoordinates(pindex).length <= 3) {
        toast.info('At least three points are required', {
          description: 'For a polygon, three points are required. If you need to input only two points, please select the multipoint type',
        });
        return;
      }
    }

    if (this.geoDataType === CoordinateType.MultiPolygon) {
      if (this.getCoordinates(pindex).length <= 3) {
        toast.info('At least three points are required', {
          description:
            'For a multipolygon, three points are required. If you need to input only two points, please select the multipoint type',
        });
        return;
      }
    }

    this.getCoordinates(pindex).removeAt(cindex);
    this.syncLastCoordinateWithFirst();
  }

  syncLastCoordinateWithFirst() {
    this.endSubscription.next();

    if (this.geoDataType !== CoordinateType.Polygon && this.geoDataType !== CoordinateType.MultiPolygon) return;

    for (const currentPolygon of this.getPolygons().controls as FormArray[]) {
      if (currentPolygon.length <= 2) return;

      for (let i = 0; i < currentPolygon.length; i++) {
        const currentCoordinate = currentPolygon.at(i) as FormGroup;

        currentCoordinate.enable();
      }

      const firstCoordinate = currentPolygon.at(0) as FormGroup;
      const lastCoordinate = currentPolygon.at(currentPolygon.length - 1) as FormGroup;

      lastCoordinate.setValue({
        x: firstCoordinate.get('x')?.value,
        y: firstCoordinate.get('y')?.value,
      });

      lastCoordinate.disable();

      firstCoordinate
        .get('x')
        ?.valueChanges.pipe(
          takeUntil(this.endSubscription),
          tap((value) => {
            lastCoordinate.get('x')?.setValue(value, { emitEvent: false });
          })
        )
        .subscribe();
      firstCoordinate
        .get('y')
        ?.valueChanges.pipe(
          takeUntil(this.endSubscription),
          tap((value) => {
            lastCoordinate.get('y')?.setValue(value, { emitEvent: false });
          })
        )
        .subscribe();
    }
  }
}
