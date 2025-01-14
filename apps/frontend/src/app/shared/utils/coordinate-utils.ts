/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Coordinates, CoordinateType } from '@forest-guard/api-interfaces';
import { utmToLatLong } from '@forest-guard/utm';
import { CoordinateInput } from '../../features/plot-of-land/add/components/coordinate-input/coordinate-input.type';

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

export const convertFromMultiPloygon = (coordinates: [number, number][][][]): CoordinateInput => {
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
