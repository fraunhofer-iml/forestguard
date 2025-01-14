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

import { BatchDto, UserOrFarmerDto } from '@forest-guard/api-interfaces';

export class DataTableUtilityService {
  /**
   * The algorithm for sorting the table. It uses the defined mat-sort-header to get deeper into object in order
   * to sort for nested properties.
   * @param item - The html item
   * @param path - The material sort header
   * @returns The objects in the sorted way
   */
  public pathDataAccessor(item: any, path: string): any {
    const returnVal = path.split('.').reduce((accumulator: any, key: string) => {
      return accumulator ? accumulator[key] : undefined;
    }, item);

    return returnVal === 'string' ? returnVal.toLowerCase().trim() : returnVal;
  }

  /**
   * Filters all attributes, if the filter string can be found
   * @param ead the ead
   * @param filter the string to filter for
   * @returns found or not found
   */
  public filterPredicate(ead: BatchDto | UserOrFarmerDto, filter: string): boolean {
    const transformedFilter = filter.trim().toLowerCase();

    const listAsFlatString = (obj: any): string => {
      let returnVal = '';
      Object.values(obj).forEach((val) => {
        if (typeof val !== 'object') {
          returnVal = returnVal + ' ' + val;
        } else if (val !== null) {
          returnVal = returnVal + ' ' + listAsFlatString(val);
        }
      });
      return returnVal.trim().toLowerCase();
    };

    return listAsFlatString(ead).includes(transformedFilter);
  }
}
