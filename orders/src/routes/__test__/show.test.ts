import request from 'supertest';
import { app } from '../../app.js';
import mongoose from 'mongoose';
import { Order } from '../../models/order.js';
import { Ticket } from '../../models/tickets.js';

it('fetches the order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const user = await global.signin();

  // Create an order 
    const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const user = await global.signin();

  // Create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch the order with a different user
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', await global.signin())
    .expect(401);
});