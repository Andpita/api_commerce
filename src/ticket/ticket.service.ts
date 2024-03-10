import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TicketEntity } from './entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketDTO } from './dtos/createTicket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
  ) {}

  async createTicket(newTicket: CreateTicketDTO): Promise<TicketEntity> {
    return await this.ticketRepository.save(newTicket);
  }

  async findAllTickets(): Promise<TicketEntity[]> {
    const tickets = await this.ticketRepository.find();

    if (!tickets || tickets.length === 0) {
      throw new NotFoundException(`Nenhum ticket encontrado`);
    }

    return tickets;
  }

  async findOneTicket(id: number): Promise<TicketEntity> {
    const ticket = await this.ticketRepository.findOne({
      where: {
        id,
      },
    });

    if (!ticket) {
      throw new BadRequestException(`Ticket ${id} não encontrada`);
    }

    return ticket;
  }
}
