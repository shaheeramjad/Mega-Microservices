import { Listener, OrderCancelledEvent, Subjects } from "@shaheertickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name.js";
import { Ticket } from "../../models/ticket.js";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher.js";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    // If ticket is found, update its reserved status
    ticket.set({ orderId: undefined });
    await ticket.save();
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      ...(ticket.orderId ? { orderId: ticket.orderId } : {}),
    });
    msg.ack();
  }
}   