export class ReturnCorreiosExternalDTO {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ddd: string;
  erro?: string;

  constructor(correios: any) {
    this.cep = correios.cep;
    this.logradouro = correios.logradouro;
    this.complemento = correios.complemento;
    this.bairro = correios.bairro;
    this.localidade = correios.localidade;
    this.uf = correios.uf;
    this.ddd = correios.ddd;
    this.erro = correios.erro;
  }
}
