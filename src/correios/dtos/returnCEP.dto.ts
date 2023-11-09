import { ReturnCorreiosExternalDTO } from './returnCorreiosExternal.dto';

export class ReturnCEPDTO {
  cep: string;
  publicPlace: string;
  complement: string;
  neigborhood: string;
  city: string;
  uf: string;
  ddd: string;

  cityId?: number;
  stateId?: number;
  error?: string;

  constructor(cep: ReturnCorreiosExternalDTO, cityId: number, stateId: number) {
    this.cep = cep.cep;
    this.publicPlace = cep.logradouro;
    this.complement = cep.complemento;
    this.neigborhood = cep.bairro;
    this.city = cep.localidade;
    this.uf = cep.uf;
    this.ddd = cep.ddd;
    this.error = cep.erro;

    this.cityId = cityId;
    this.stateId = stateId;
  }
}
