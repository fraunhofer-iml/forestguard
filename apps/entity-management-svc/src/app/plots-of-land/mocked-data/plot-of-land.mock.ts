import { GeoDataDto,Standard,CoordinateType } from '@forest-guard/api-interfaces';
import { PlotOfLand, Role } from '@prisma/client';

const givenUser = {
  id: '1',
  firstName: 'Peter',
  lastName: 'Tester',
  email: '',
  mobilePhoneNumber: '',
  role: Role.FARMER,
  entityId: undefined,
  companyId: undefined,
  employeeId: undefined,
  addressId: undefined,
  personalId: undefined,
};

const givenGeoDataDto = new GeoDataDto(Standard.UTM, CoordinateType.MultiPoint, [
  [
    [1, 2],
    [3, 4],
  ],
]);

const expectedPlotOfLandDto: PlotOfLand = {
  id: '1',
  areaInHA: 1,
  country: 'Germany',
  description: 'Description',
  district: 'District',
  geoData: undefined, // will be set in beforeEach
  region: 'Region',
  localPlotOfLandId: 'Local',
  nationalPlotOfLandId: 'National',
  cultivationId: '1',
  farmerId: '1',
};

export { givenUser, givenGeoDataDto, expectedPlotOfLandDto };
