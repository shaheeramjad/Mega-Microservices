import {Publisher, Subjects, TicketUpdatedEvent} from '@shaheertickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}