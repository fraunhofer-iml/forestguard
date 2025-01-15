/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
