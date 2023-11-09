import { Controller, Get, Param } from '@nestjs/common';
import { CorreiosService } from './correios.service';
import { ReturnCEPDTO } from './dtos/returnCEP.dto';

@Controller('correios')
export class CorreiosController {
  constructor(private readonly correiosService: CorreiosService) {}

  @Get('/frete/:cep')
  async getFrete(@Param('cep') cep: string) {
    return this.correiosService.calcFrete(cep, 1000);
  }

  @Get('/:cep')
  async findCep(@Param('cep') cep: string): Promise<ReturnCEPDTO> {
    return await this.correiosService.findAddressByCEP(cep);
  }
}
