import mongoose from "mongoose";
import { Order } from "./order.js";
import { OrderStatus } from "@shaheertickets/common";

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  id: string;
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function (this: TicketDoc) {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });

  return !!existingOrder;
} as unknown as (this: mongoose.Document, ...args: any[]) => any;

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };