export enum RoleType {
  FARMER = 'FARMER',
  EMPLOYEE = 'EMPLOYEE',
}

export class UserUpdateDto {
  employeeId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobilePhoneNumber?: string;
  role?: RoleType;

  constructor(employeeId?: string, firstName?: string, lastName?: string, email?: string, mobilePhoneNumber?: string, role?: RoleType) {
    this.employeeId = employeeId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.role = role;
  }
}
