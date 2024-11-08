import { Injectable } from '@nestjs/common';
import { CoordinateType, FarmerAndPlotOfLand, FarmerCreateDto, ImportDto, MasterDataImportService, PlotOfLandCreateDto, RoleType, Standard, UserUpdateDto } from '@forest-guard/api-interfaces';
import * as XLSX from 'xlsx';
import { COMPANY_IDENTIFIER, HardcodedPlotsOfLandData, TOTAL_XLSX_SHEETS, ENTRY_SHEET_INDEX, XlsxColumn, Address, HardcodedEmployee } from './ubiriki-import-hardcoded';
import 'multer';

@Injectable()
export class UbirikiImportService implements MasterDataImportService {
  readonly COMPANY_IDENTIFIER =  COMPANY_IDENTIFIER;

  async import(
    file: Express.Multer.File,
  ): Promise<ImportDto> {

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
          personalId: JSON.stringify(userData[XlsxColumn.personalId]),
          email: '',
          address: Address,
        };

        const plotOfLandDto: PlotOfLandCreateDto = {
          country: HardcodedPlotsOfLandData.country,
          region: HardcodedPlotsOfLandData.region,
          district: HardcodedPlotsOfLandData.district,
          nationalPlotOfLandId: HardcodedPlotsOfLandData.nationalPlotOfLandId,
          localPlotOfLandId: userData[XlsxColumn.employeeId],
          description: HardcodedPlotsOfLandData.description,
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
