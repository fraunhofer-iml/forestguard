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

import { P2, P3, P4, P5 } from './constants';

export const toDegrees = (radian: number): number => (radian / Math.PI) * 180;
export const toRadians = (degree: number): number => (degree * Math.PI) / 180;
export const zoneNumberToCentralLongitude = (zoneNumber: number): number => (zoneNumber - 1) * 6 - 180 + 3;
export const meridionalArc = (mu: number) => {
  return mu + P2 * Math.sin(2 * mu) + P3 * Math.sin(4 * mu) + P4 * Math.sin(6 * mu) + P5 * Math.sin(8 * mu);
};
