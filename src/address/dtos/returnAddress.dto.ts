import { ReturnCityDTO } from '../../city/dtos/returnCity.dto';
import { AddressEntity } from '../entities/address.entity';

export class ReturnAddressDTO {
  id: number;
  complement: string;
  numberAddress: number;
  cep: string;
  city?: ReturnCityDTO;

  constructor(address: AddressEntity) {
    this.id = address.id;
    this.complement = address.complement;
    this.numberAddress = address.numberAddress;
    this.cep = address.cep;
    this.city = address.city ? new ReturnCityDTO(address.city) : undefined;
  }
}
