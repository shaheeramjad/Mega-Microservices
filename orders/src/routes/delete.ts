import { NotFoundError , NotAuthorizedError, OrderStatus, requireAuth} from '@shaheertickets/common';
import express,{Request, Response} from 'express';
import { Order } from '../models/order.js';
import { natsWrapper } from '../nats-wrapper.js';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher.js';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const { orderId } = req.params;
    // Find the order
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    // Publish an event saying that an order was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    });
    res.status(204).send(order);
});

export {router as deleteOrderRouter};
