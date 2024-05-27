export class UserDto {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  mobilePhoneNumber: string;

  constructor(id: string, employeeId: string, firstName: string, lastName: string, email: string, role: string, mobilePhoneNumber: string) {
    this.id = id;
    this.employeeId = employeeId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.role = role;
    this.mobilePhoneNumber = mobilePhoneNumber;
  }
}
