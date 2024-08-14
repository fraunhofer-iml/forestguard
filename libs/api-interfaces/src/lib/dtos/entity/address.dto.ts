import { AddressCreateDto } from './address-create.dto';

export class AddressDto extends AddressCreateDto {
  id: string;

  constructor(id: string, street: string, postalCode: string, city: string, state: string, country: string) {
    super(street, postalCode, city, state, country);
    this.id = id;
  }
}
