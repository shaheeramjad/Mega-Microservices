import {Message} from 'node-nats-streaming';
import {Listener, Subjects, TicketCreatedEvent} from '@shaheertickets/common';
import { Ticket } from '../../models/tickets.js';
import { queueGroupName } from './queue-group-name.js';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const ticket = Ticket.build({
      id: data.id,
      title: data.title,
      price: data.price,
      version: data.version,
    });
    await ticket.save();

    msg.ack();
  }
}   
