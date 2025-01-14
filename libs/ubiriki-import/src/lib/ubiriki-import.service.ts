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

import {
  CoordinateType,
  FarmerAndPlotOfLand,
  FarmerCreateDto,
  ImportDto,
  MasterDataImportService,
  PlotOfLandCreateDto,
  RoleType,
  Standard,
} from '@forest-guard/api-interfaces';
import * as XLSX from 'xlsx';
import { Injectable } from '@nestjs/common';
import {
  Address,
  COMPANY_IDENTIFIER,
  ENTRY_SHEET_INDEX,
  HardcodedEmployee,
  HardcodedPlotsOfLandData,
  TOTAL_XLSX_SHEETS,
  XlsxColumn,
} from './ubiriki-import-hardcoded';
import 'multer';

@Injectable()
export class UbirikiImportService implements MasterDataImportService {
  readonly COMPANY_IDENTIFIER = COMPANY_IDENTIFIER;

  async import(file: Express.Multer.File): Promise<ImportDto> {
    const farmersAndPlotsOfLand: FarmerAndPlotOfLand[] = [];

    const xlsxDocument = XLSX.read(Buffer.from(file.buffer));

    for (let i = ENTRY_SHEET_INDEX; i < TOTAL_XLSX_SHEETS; i++) {
      const sheet = xlsxDocument.Sheets[xlsxDocument.SheetNames[i]];
      const sheetData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      for (const userData of sheetData) {
        if (isNaN(userData[XlsxColumn.personalId])) {
          continue;
        }

        const farmerDto: FarmerCreateDto = {
          employeeId: userData[XlsxColumn.employeeId],
          firstName: '',
          lastName: userData[XlsxColumn.name],
          role: RoleType.FARMER,
          mobilePhoneNumber: '',
          personalId: userData[XlsxColumn.personalId].toString(),
          email: '',
          address: Address,
        };

        const plotOfLandDto: PlotOfLandCreateDto = {
          country: HardcodedPlotsOfLandData.country,
          region: HardcodedPlotsOfLandData.region,
          district: HardcodedPlotsOfLandData.district,
          nationalPlotOfLandId: HardcodedPlotsOfLandData.nationalPlotOfLandId,
          localPlotOfLandId: userData[XlsxColumn.employeeId],
          description: userData[XlsxColumn.description],
          geoData: {
            standard: Standard.UTM,
            coordinateType: CoordinateType.Point,
            coordinates: [userData[XlsxColumn.xCoordinate], userData[XlsxColumn.yCoordinate]],
            zone: userData[XlsxColumn.zone],
          },
          areaInHA: userData[XlsxColumn.areaInHA],
          province: HardcodedPlotsOfLandData.province,
          cultivationQuality: userData[XlsxColumn.cultivationQuality],
          cultivationSort: HardcodedPlotsOfLandData.cultivationSort,
        };

        const farmerAndPlotOfLand = new FarmerAndPlotOfLand(farmerDto, plotOfLandDto);
        farmersAndPlotsOfLand.push(farmerAndPlotOfLand);
      }
    }

    return {
      employees: [HardcodedEmployee],
      farmersAndPlotsOfLand: farmersAndPlotsOfLand,
    };
  }
}
