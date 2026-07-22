import {Publisher, Subjects, TicketCreatedEvent} from '@shaheertickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}