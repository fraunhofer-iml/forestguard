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

export const convertToMultiPoint = (geoData: CoordinateInput): number[][] => {
  return geoData.flatMap((coordinate) => coordinate.map((point) => [point.x, point.y]));
};

export const convertToPolygon = (geoData: CoordinateInput): number[][][] => {
  return geoData.map((polygon) => polygon.map((point) => [point.x, point.y]));
};

export const convertToMultiPolygon = (geoData: CoordinateInput): number[][][][] => {
  return [geoData.map((polygon) => polygon.map((point) => [point.x, point.y]))];
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
