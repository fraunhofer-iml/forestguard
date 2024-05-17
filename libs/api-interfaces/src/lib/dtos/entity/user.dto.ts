import { EntityDto } from './entity.dto';

export interface UserDto extends EntityDto {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  mobilePhoneNumber: string;
}
