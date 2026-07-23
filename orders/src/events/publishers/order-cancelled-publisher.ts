import {Publisher, Subjects, OrderCreatedEvent, OrderCancelledEvent} from '@shaheertickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}