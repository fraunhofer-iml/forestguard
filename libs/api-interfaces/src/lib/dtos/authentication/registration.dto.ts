export class RegistrationDto {
  email: string;
  password: string;
  role?: string;
  firstName?: string;
  lastName?: string;

  constructor(email: string, password: string, role?: string, firstName?: string, lastName?: string) {
    this.email = email;
    this.password = password;
    this.role = role;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
