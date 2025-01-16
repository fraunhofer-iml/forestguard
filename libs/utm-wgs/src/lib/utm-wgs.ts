/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { E, K0, M1, R, SQRT_E } from './constants';
import { meridionalArc, toDegrees, zoneNumberToCentralLongitude } from './utils';

interface ToLatLonProps {
  easting: number;
  northing: number;
  utmRef: string;
  strict?: boolean;
  decimals?: number;
}

interface LatLon {
  latitude: number;
  longitude: number;
}

function parseUtmRef(utmRef: string): { zoneNumber: number; northern: boolean } {
  const zoneNumber = parseInt(utmRef.slice(0, -1), 10);
  const hemisphere = utmRef.slice(-1).toUpperCase();
  const northern = hemisphere >= 'N';
  return { zoneNumber, northern };
}

export function utmToLatLong({ easting, northing, utmRef, strict = true, decimals = 6 }: ToLatLonProps): LatLon {
  const { zoneNumber, northern } = parseUtmRef(utmRef);

  if (strict) {
    if (easting < 100000 || easting >= 1000000) {
      throw new RangeError('easting out of range (must be between 100,000m and 999,999m)');
    }
    if (northing < 0 || northing >= 10000000) {
      throw new RangeError('northing out of range (must be between 0m and 10,000,000m)');
    }
  }
  if (isNaN(zoneNumber) || zoneNumber < 1 || zoneNumber > 60) {
    throw new RangeError('zoneNumber out of range (must be between 1 and 60)');
  }

  const x = easting - 500000;
  let y = northing;

  if (!northern) y -= 1e7;

  const m = y / K0;
  const mu = m / (R * M1);

  const pRadian = meridionalArc(mu);

  const N1 = R / Math.sqrt(1 - E * Math.pow(Math.sin(pRadian), 2));
  const T1 = Math.pow(Math.tan(pRadian), 2);
  const C1 = SQRT_E * Math.pow(Math.cos(pRadian), 2);
  const R1 = (R * (1 - E)) / Math.pow(1 - E * Math.pow(Math.sin(pRadian), 2), 1.5);
  const D = x / (N1 * K0);

  const lat =
    pRadian -
    ((N1 * Math.tan(pRadian)) / R1) *
      (Math.pow(D, 2) / 2 -
        ((5 + 3 * T1 + 10 * C1 - 4 * Math.pow(C1, 2) - 9 * SQRT_E) * Math.pow(D, 4)) / 24 +
        ((61 + 90 * T1 + 298 * C1 + 45 * Math.pow(T1, 2) - 252 * SQRT_E - 3 * Math.pow(C1, 3)) * Math.pow(D, 6)) / 720);
  const lon =
    (D -
      ((1 + 2 * T1 + C1) * Math.pow(D, 3)) / 6 +
      ((5 - 2 * C1 + 28 * T1 - 3 * Math.pow(C1, 2) + 8 * SQRT_E + 24 * Math.pow(T1, 2)) * Math.pow(D, 5)) / 120) /
    Math.cos(pRadian);
  return {
    latitude: Number(toDegrees(lat).toFixed(decimals)),
    longitude: Number((toDegrees(lon) + zoneNumberToCentralLongitude(zoneNumber)).toFixed(decimals)),
  };
}
