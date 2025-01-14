/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { P2, P3, P4, P5 } from './constants';

export const toDegrees = (radian: number): number => (radian / Math.PI) * 180;
export const toRadians = (degree: number): number => (degree * Math.PI) / 180;
export const zoneNumberToCentralLongitude = (zoneNumber: number): number => (zoneNumber - 1) * 6 - 180 + 3;
export const meridionalArc = (mu: number) => {
  return mu + P2 * Math.sin(2 * mu) + P3 * Math.sin(4 * mu) + P4 * Math.sin(6 * mu) + P5 * Math.sin(8 * mu);
};
