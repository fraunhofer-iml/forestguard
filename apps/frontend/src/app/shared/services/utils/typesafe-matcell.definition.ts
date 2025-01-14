/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Observable } from 'rxjs';
import { CdkCellDef } from '@angular/cdk/table';
import { Directive, Input } from '@angular/core';
import { MatCellDef, MatTableDataSource } from '@angular/material/table';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[matCellDef]',
  providers: [{ provide: CdkCellDef, useExisting: TypeSafeMatCellDefDirective }],
})
export class TypeSafeMatCellDefDirective<T> extends MatCellDef {
  // leveraging syntactic-sugar syntax when we use *matCellDef
  @Input() matCellDefDataSource: T[] | Observable<T[]> | MatTableDataSource<T> | undefined;

  // ngTemplateContextGuard flag to help with the Language Service
  static ngTemplateContextGuard<T>(dir: TypeSafeMatCellDefDirective<T>, ctx: unknown): ctx is { $implicit: T; index: number } {
    return true;
  }
}
