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

import { CoordinateType, FarmerAndPlotOfLand, ImportDto, Standard } from '@forest-guard/api-interfaces';

const FARMER_AND_PLOT_OF_LAND_MOCK: FarmerAndPlotOfLand = {
  farmer: {
    lastName: '',
    personalId: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      additionalInformation: '',
    },
  },
  plotOfLand: {
    country: '',
    region: '',
    province: '',
    district: '',
    description: '',
    geoData: {
      standard: Standard.UTM,
      coordinateType: CoordinateType.Point,
      coordinates: [],
      zone: '',
    },
    areaInHA: 0,
    cultivationSort: '',
    cultivationQuality: '',
  },
};

const IMPORT_DTO_MOCK: ImportDto = {
  employees: [{
    lastName: '',
  }],
  farmersAndPlotsOfLand: [FARMER_AND_PLOT_OF_LAND_MOCK],
};

export { IMPORT_DTO_MOCK, FARMER_AND_PLOT_OF_LAND_MOCK };
