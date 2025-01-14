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

import { batch1Mock } from '@forest-guard/api-interfaces';
import { TestBed } from '@angular/core/testing';
import { DataTableUtilityService } from './data-table-utility.service';

describe('DataTableUtilityService', () => {
  let service: DataTableUtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [DataTableUtilityService] });

    service = TestBed.inject(DataTableUtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('pathDataAccessor should return nested property', () => {
    const item = { a: { b: 'test' } };
    const result = service.pathDataAccessor(item, 'a.b');
    expect(result).toEqual('test');
  });

  it('filterPredicate should return true if filter string is found', () => {
    const result = service.filterPredicate(batch1Mock, 'test');
    expect(result).toBeTruthy();
  });
});
