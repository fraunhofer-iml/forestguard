import { Coordinates, CoordinateType } from '@forest-guard/api-interfaces';

export type GeoInformation = {
  type: string;
  features: {
    type: string;
    properties: {
      [key: string]: string;
    };
    geometry: {
      type: CoordinateType;
      coordinates: Coordinates;
    };
  }[];
};
