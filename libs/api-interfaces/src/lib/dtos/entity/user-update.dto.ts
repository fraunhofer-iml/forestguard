export class UserUpdateDto {
  employeeId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobilePhoneNumber?: string;
  role?: string;

  constructor(employeeId?: string, firstName?: string, lastName?: string, email?: string, mobilePhoneNumber?: string, role?: string) {
    this.employeeId = employeeId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.role = role;
  }
}
