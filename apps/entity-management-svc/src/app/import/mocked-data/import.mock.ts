import { CoordinateType, FarmerAndPlotOfLand, ImportDto, Standard } from '@forest-guard/api-interfaces';

const FARMER_AND_PLOT_OF_LAND_MOCK: FarmerAndPlotOfLand = {
  farmer: {
    lastName: '',
    personalId: 'personalId1',
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
