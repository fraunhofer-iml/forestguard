/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
