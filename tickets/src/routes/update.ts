import express, { Request, Response } from 'express';
import {body} from 'express-validator';
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError, type TicketUpdatedEvent, BadRequestError } from '@shaheertickets/common';
import { Ticket } from '../models/ticket.js';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher.js';
import { natsWrapper } from '../nats-wrapper.js';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0')
], validateRequest, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  if (ticket.orderId) {
    throw new BadRequestError('Cannot edit a reserved ticket');
  }

  // Reservations are controlled by order events, never by a ticket update request.
  if (Object.prototype.hasOwnProperty.call(req.body, 'orderId')) {
    throw new BadRequestError('Cannot update a ticket reservation');
  }

  if (ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  ticket.set({
    title: req.body.title,
    price: req.body.price
  });
  await ticket.save();

  const eventData: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version,
  };

  if (ticket.orderId !== undefined) {
    eventData.orderId = ticket.orderId;
  }

  new TicketUpdatedPublisher(natsWrapper.client).publish(eventData);

  res.send(ticket);
});

export { router as updateTicketRouter };
