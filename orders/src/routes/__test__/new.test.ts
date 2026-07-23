import request from 'supertest';
import { app } from '../../app.js';
import mongoose from 'mongoose';
import { OrderStatus } from '@shaheertickets/common';
import { Ticket } from '../../models/tickets.js';
import { Order } from '../../models/order.js';
import { natsWrapper } from '../../nats-wrapper.js';

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', await global.signin())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'alskdjflkasjdf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', await global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', await global.signin())
    .send({ ticketId: ticket.id });

  console.log('Status:', response.status);
  console.log('Body:', response.body);

  expect(response.status).toBe(201);
});

it('emits an order created event', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', await global.signin())
    .send({ ticketId: ticket.id });

  console.log('Status:', response.status);
  console.log('Body:', response.body);

  expect(response.status).toBe(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});