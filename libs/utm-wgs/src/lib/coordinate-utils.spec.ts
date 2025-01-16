/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoordinateType } from '@forest-guard/api-interfaces';
import {
  convertToCorrectFormat,
  convertToMultiPoint,
  convertToMultiPolygon,
  convertToPoint,
  convertToPolygon, convertUTMtoWGS,
} from './coordinate-utils';

describe('Coordinate Utils', () => {
  const sampleInput = [[{ x: 500000, y: 4649776 }], [{ x: 500000, y: 4649776 }]];

  describe('convertToCorrectFormat', () => {
    it('should convert to Point format', () => {
      const result = convertToCorrectFormat(sampleInput, CoordinateType.Point);
      expect(result).toEqual([500000, 4649776]);
    });

    it('should convert to MultiPoint format', () => {
      const result = convertToCorrectFormat(sampleInput, CoordinateType.MultiPoint);
      expect(result).toEqual([
        [500000, 4649776],
        [500000, 4649776],
      ]);
    });

    it('should convert to Polygon format', () => {
      const result = convertToCorrectFormat(sampleInput, CoordinateType.Polygon);
      expect(result).toEqual([[[500000, 4649776]], [[500000, 4649776]]]);
    });

    it('should convert to MultiPolygon format', () => {
      const result = convertToCorrectFormat(sampleInput, CoordinateType.MultiPolygon);
      expect(result).toEqual([[[[500000, 4649776]], [[500000, 4649776]]]]);
    });

    it('should return empty array', () => {
      const result = convertToCorrectFormat(sampleInput, undefined as any);
      expect(result).toEqual([]);
    });
  });

  describe('convertToPoint', () => {
    it('should convert to Point format', () => {
      const result = convertToPoint(sampleInput);
      expect(result).toEqual([500000, 4649776]);
    });
  });

  describe('convertToMultiPoint', () => {
    it('should convert to MultiPoint format', () => {
      const result = convertToMultiPoint(sampleInput);
      expect(result).toEqual([
        [500000, 4649776],
        [500000, 4649776],
      ]);
    });
  });

  describe('convertToPolygon', () => {
    it('should convert to Polygon format', () => {
      const result = convertToPolygon(sampleInput);
      expect(result).toEqual([[[500000, 4649776]], [[500000, 4649776]]]);
    });
  });

  describe('convertToMultiPolygon', () => {
    it('should convert to MultiPolygon format', () => {
      const result = convertToMultiPolygon(sampleInput);
      expect(result).toEqual([[[[500000, 4649776]], [[500000, 4649776]]]]);
    });
  });

  describe('convertUTMtoWGS', () => {
    it('should convert UTM to WGS format', () => {
      const result = convertUTMtoWGS(sampleInput, '33');
      expect(result).toEqual([[{ x: expect.any(Number), y: expect.any(Number) }], [{ x: expect.any(Number), y: expect.any(Number) }]]);
    });
  });
});
