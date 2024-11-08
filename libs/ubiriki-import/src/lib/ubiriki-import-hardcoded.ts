import { AddressCreateDto, RoleType, UserUpdateDto } from "@forest-guard/api-interfaces";

export const COMPANY_IDENTIFIER = 'Acme Corp 2';

export const ENTRY_SHEET_INDEX = 1;

export const TOTAL_XLSX_SHEETS = 5;

export const XlsxColumn = {
    employeeId: 1,
    name: 2,
    personalId:3,
    zone: 5,
    xCoordinate: 6,
    yCoordinate: 7,
    areaInHA: 9,
    cultivationQuality: 28,
}

export const Address: AddressCreateDto = {
    street: 'Carretera Marginal Km.61',
    postalCode: '',
    city: 'Pichanaki',
    state: 'Junin',
    country: 'Peru',
    additionalInformation: '',
}
    
export const HardcodedPlotsOfLandData = {
    country: 'Peru',
    region: 'Junín',
    province: 'Chanchamayo',
    district: 'Pichanaki',
    nationalPlotOfLandId: '',
    description: '',
    address: Address,
    cultivationSort: 'Arabica',
}

export const HardcodedEmployee: UserUpdateDto = {
    firstName: "",
    lastName: "Cesar Maquera",
    email: "",
    mobilePhoneNumber: "",
    role: RoleType.EMPLOYEE,
}


