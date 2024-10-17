export class AddressCreateDto {
    street: string;
    postalCode: string;
    city: string;
    state: string;
    country: string;
    additionalInformation: string;

    constructor(street: string, postalCode: string, city: string, state: string, country: string, additionalInformation: string) {
      this.street = street;
      this.postalCode = postalCode;
      this.city = city;
      this.state = state;
      this.country = country;
      this.additionalInformation = additionalInformation;
    }
  }
