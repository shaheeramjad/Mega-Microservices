import {Publisher, Subjects, OrderCreatedEvent} from '@shaheertickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}