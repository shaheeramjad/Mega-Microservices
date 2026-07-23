import request from 'supertest';
import { app } from '../../app.js';
import mongoose from 'mongoose';
import { Order } from '../../models/order.js';
import { Ticket } from '../../models/tickets.js';
import { natsWrapper } from '../../nats-wrapper.js';

it('marks an order as cancelled', async () => {
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

  // Make request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(204);

  // Expectation to make sure the order is cancelled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual('cancelled');
});

    it("emits an order cancelled event", async () => {
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

      // Make request to cancel the order
      await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(204);

      expect(natsWrapper.client.publish).toHaveBeenCalled();
    });