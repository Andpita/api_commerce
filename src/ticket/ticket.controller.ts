import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDTO } from './dtos/createTicket.dto';
import { UserType } from 'src/user/enum/user-type.enum';
import { Roles } from 'src/decorator/roles.decorator';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async createCategory(
    @Body() ticket: CreateTicketDTO,
  ): Promise<CreateTicketDTO> {
    return await this.ticketService.createTicket(ticket);
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get()
  @UsePipes(ValidationPipe)
  async findAllCategories(): Promise<CreateTicketDTO[]> {
    return await this.ticketService.findAllTickets();
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get(':id')
  @UsePipes(ValidationPipe)
  async findOneCategoryById(@Param('id') id: number): Promise<CreateTicketDTO> {
    return await this.ticketService.findOneTicket(id);
  }
}
