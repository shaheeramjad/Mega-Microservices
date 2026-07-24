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
  version: number;
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
    versionKey: 'version',
    optimisticConcurrency: true,
    timestamps: true,
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

// Ensure repeated saves produce an update, so Mongoose advances `version`.
orderSchema.pre('save', function () {
  if (!this.isNew) {
    this.set('updatedAt', new Date());
  }
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
