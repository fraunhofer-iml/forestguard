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

export const K0 = 0.9996;

export const E = 0.00669438;
export const E2 = E * E;
export const E3 = E2 * E;

export const SQRT_E = Math.sqrt(1 - E);
export const _E = (1 - SQRT_E) / (1 + SQRT_E);
export const _E2 = _E * _E;
export const _E3 = _E2 * _E;
export const _E4 = _E3 * _E;
export const _E5 = _E4 * _E;

export const M1 = 1 - E / 4 - (3 * E2) / 64 - (5 * E3) / 256;

export const P2 = (3 / 2) * _E - (27 / 32) * _E3 + (269 / 512) * _E5;
export const P3 = (21 / 16) * _E2 - (55 / 32) * _E4;
export const P4 = (151 / 96) * _E3 - (417 / 128) * _E5;
export const P5 = (1097 / 512) * _E4;

export const R = 6378137;
