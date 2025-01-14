/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Standard {
  WGS = 'WGS',
  UTM = 'UTM',
}

export enum CoordinateType {
  Point = 'Point',
  MultiPoint = 'MultiPoint',
  Polygon = 'Polygon',
  MultiPolygon = 'MultiPolygon',
}

export type Coordinates = number[] | number[][] | number[][][] | number[][][][];

export class GeoDataDto {
  // possibly a validation for type
  standard: Standard;
  coordinateType: CoordinateType;
  coordinates: Coordinates;
  zone: string;

  constructor(standard: Standard, coordinateType: CoordinateType, coordinates: Coordinates, zone?: string) {
    this.standard = standard;
    this.coordinateType = coordinateType;
    this.coordinates = coordinates;
    this.zone = zone || '';
  }
}
