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

import { CoordinateType } from '@forest-guard/api-interfaces';
import {
  convertToCorrectFormat,
  convertToMultiPoint,
  convertToMultiPolygon,
  convertToPoint,
  convertToPolygon,
  convertUTMtoWGS,
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
