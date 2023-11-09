import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { ReturnCorreiosExternalDTO } from './dtos/returnCorreiosExternal.dto';
import { CityService } from '../city/city.service';
import { ReturnCEPDTO } from './dtos/returnCEP.dto';
import { CityEntity } from '../city/entities/city.entity';
import { ResponsePriceCorreios } from './dtos/response-price-correios.dto';
import { CdFormatEnum } from './enum/cd-format.enum';
import { SizeProductDTO } from './dtos/size-product.dto';
import { Client } from 'nestjs-soap';
import { ReturnFreteDTO } from './dtos/returnDataFrete.dto';

@Injectable()
export class CorreiosService {
  URL_CORREIOS = process.env.URL_CEP_CORREIOS;
  CEP_COMPANY = process.env.CEP_COMPANY;
  constructor(
    @Inject('SOAP_CORREIOS') private readonly soapClient: Client,
    private readonly httpService: HttpService,
    private readonly cityService: CityService,
  ) {}
  urlCEP = process.env.URL_CEP;

  async findAddressByCEP(cep: string): Promise<ReturnCEPDTO> {
    const returnCep = await this.httpService.axiosRef
      .get<ReturnCorreiosExternalDTO>(this.urlCEP.replace('{cep}', cep))
      .catch((error: AxiosError) => {
        throw new BadRequestException(
          `Erro ao consultar CEP. ${error.message}`,
        );
      });

    const cityInfo: CityEntity | undefined = await this.cityService
      .findCityByName(returnCep.data.localidade, returnCep.data.uf)
      .catch(() => undefined);

    return new ReturnCEPDTO(returnCep.data, cityInfo?.id, cityInfo?.stateId);
  }

  async priceDelivery(
    cdService: string,
    cep: string,
    sizeProduct: SizeProductDTO,
  ): Promise<ResponsePriceCorreios> {
    return new Promise((resolve) => {
      this.soapClient.CalcPrecoPrazo(
        {
          nCdServico: cdService,
          sCepOrigem: this.CEP_COMPANY,
          sCepDestino: cep,
          nCdFormato: CdFormatEnum.BOX,
          nVlPeso: sizeProduct.weight,
          nVlComprimento: sizeProduct.length,
          nVlAltura: sizeProduct.height,
          nVlLargura: sizeProduct.width,
          nVlDiametro: sizeProduct.diameter,
          nCdEmpresa: '',
          sDsSenha: '',
          sCdMaoPropria: 'N',
          nVlValorDeclarado: 0,
          sCdAvisoRecebimento: 'N',
        },
        (_, res: ResponsePriceCorreios) => {
          if (res) {
            resolve(res);
          } else {
            throw new BadRequestException('Error SOAP');
          }
        },
      );
    });
  }

  async calcFrete(cep: string, weight: number): Promise<any> {
    if (weight === 0) {
      weight = 1000;
    }

    const infoPrice = await this.httpService.axiosRef.get(
      `https://www.cepcerto.com/ws/json-frete/88021062/${cep}/${weight}/20/20/20/3a0a00f652fd6e9615ef8a86731322addddbc35c`,
    );

    const originalData = { ...infoPrice.data };
    console.log(originalData);
    const originalPac = +Number(
      originalData.valorpac.replace(',', '.'),
    ).toFixed(2);
    const originalSedex = +Number(
      originalData.valorsedex.replace(',', '.'),
    ).toFixed(2);

    const newData: ReturnFreteDTO = {
      ...originalData,
      valorpac: originalPac,
      valorsedex:
        originalSedex > originalPac ? originalSedex : originalPac * 1.5,
    };

    return newData;
  }
}
