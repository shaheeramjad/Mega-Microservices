import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@shaheertickets/common';
import { TicketCreatedListener } from '../ticket-created-listener.js';
import { natsWrapper } from '../../../nats-wrapper.js';
import { Ticket } from '../../../models/tickets.js';

it('creates and saves a ticket', async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
  expect(ticket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
