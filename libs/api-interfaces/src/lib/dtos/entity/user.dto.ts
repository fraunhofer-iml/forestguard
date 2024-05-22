import { EntityDto } from './entity.dto';

export class UserDto extends EntityDto {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  mobilePhoneNumber: string;

  constructor(id: string, employeeId: string, firstName: string, lastName: string, email: string, role: string, mobilePhoneNumber: string) {
    super(id);
    this.employeeId = employeeId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.role = role;
    this.mobilePhoneNumber = mobilePhoneNumber;
  }
}
