/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoordinateInput } from './coordinate-input.type';
import { utmToLatLong } from './utm-wgs';
import { Coordinates, CoordinateType } from '@forest-guard/api-interfaces';

export const convertToCorrectFormat = (coordinates: CoordinateInput, type: CoordinateType): Coordinates => {
  switch (type) {
    case CoordinateType.Point:
      return convertToPoint(coordinates);
    case CoordinateType.MultiPoint:
      return convertToMultiPoint(coordinates);
    case CoordinateType.Polygon:
      return convertToPolygon(coordinates);
    case CoordinateType.MultiPolygon:
      return convertToMultiPolygon(coordinates);
    default:
      return [];
  }
};

export const convertCoordinates = (coordinates: Coordinates, zone: string, coordinateType: CoordinateType): Coordinates => {
  switch (coordinateType) {
    case CoordinateType.Point: {
      const point = convertFromPoint(coordinates as [number, number]);
      const convertedCoordinates = convertUTMtoWGS(point, zone);
      return convertToPoint(convertedCoordinates);
    }
    case CoordinateType.MultiPoint: {
      const multiPoint = convertFromMultiPoint(coordinates as [number, number][]);
      const convertedCoordinates = convertUTMtoWGS(multiPoint, zone);
      return convertToMultiPoint(convertedCoordinates);
    }
    case CoordinateType.Polygon: {
      const polygon = convertFromPolygon(coordinates as [number, number][][]);
      const convertedCoordinates = convertUTMtoWGS(polygon, zone);
      return convertToPolygon(convertedCoordinates);
    }
    case CoordinateType.MultiPolygon: {
      const multiPolygon = convertFromMultiPolygon(coordinates as [number, number][][][]);
      const convertedCoordinates = convertUTMtoWGS(multiPolygon, zone);
      return convertToMultiPolygon(convertedCoordinates);
    }
  }
}

export const convertToPoint = (geoData: CoordinateInput): number[] => {
  return geoData[0].map((point) => [point.x, point.y]).flat();
};

export const convertFromPoint = (coordinates: [number, number]): CoordinateInput => {
  return [
    [
      {
        x: coordinates[0],
        y: coordinates[1],
      },
    ],
  ];
};

export const convertToMultiPoint = (geoData: CoordinateInput): number[][] => {
  return geoData.flatMap((coordinate) => coordinate.map((point) => [point.x, point.y]));
};

export const convertFromMultiPoint = (coordinates: [number, number][]): CoordinateInput => {
  return [coordinates.flatMap((point) => convertFromPoint(point).flatMap((coordinate) => coordinate))];
};

export const convertToPolygon = (geoData: CoordinateInput): number[][][] => {
  return geoData.map((polygon) => polygon.map((point) => [point.x, point.y]));
};

export const convertFromPolygon = (coordinates: [number, number][][]): CoordinateInput => {
  return [coordinates.flatMap((polygon) => convertFromMultiPoint(polygon).flatMap((coordinates) => coordinates))];
};

export const convertToMultiPolygon = (geoData: CoordinateInput): number[][][][] => {
  return [geoData.map((polygon) => polygon.map((point) => [point.x, point.y]))];
};

export const convertFromMultiPolygon = (coordinates: [number, number][][][]): CoordinateInput => {
  return coordinates.flatMap((polygons) => polygons.flatMap((polygon) => convertFromMultiPoint(polygon)));
};

export const convertUTMtoWGS = (geoData: CoordinateInput, zone: string): CoordinateInput => {
  const coordinates = JSON.parse(JSON.stringify(geoData)) as CoordinateInput;

  return [
    ...coordinates.map((coordinate) => {
      return coordinate.map((point) => {
        if (point.x !== null && point.y !== null) {
          const coordinate = utmToLatLong({
            easting: point.x,
            northing: point.y,
            utmRef: zone,
          });

          point.x = coordinate.latitude;
          point.y = coordinate.longitude;
        }

        return point;
      });
    }),
  ];
};

/*

Point: [[{x, y}]] -> [x, y]
MultiPoint: [[{x, y}, {x, y}]] -> [[x, y], [x, y]]
Polygon: [[{x,y}, {x,y}, {x,y}, {x,y}, {x,y}, {x,y}]] -> [[[x,y], [x,y], [x,y], [x,y], [x,y], [x,y]]]
MultiPolygon: [[{x,y}, {x,y}, {x,y}], [{x,y}, {x,y}, {x,y}], [{x,y}, {x,y}, {x,y}]] -> [[[[x,y], [x,y], [x,y], [x,y], [x,y]]], [[[x,y], [x,y], [x,y], [x,y], [x,y]]], [[[x,y], [x,y], [x,y], [x,y], [x,y]]]]

*/
