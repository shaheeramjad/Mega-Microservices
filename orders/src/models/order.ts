import mongoose from 'mongoose';
import {OrderStatus} from '@shaheertickets/common';
import { TicketDoc } from './tickets.js';

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  id: string;
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
   ticket: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Ticket',
  required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };