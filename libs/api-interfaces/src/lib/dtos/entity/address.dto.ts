export class AddressDto {
  street: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;

  constructor(street: string, postalCode: string, city: string, state: string, country: string) {
    this.street = street;
    this.postalCode = postalCode;
    this.city = city;
    this.state = state;
    this.country = country;
  }
}
