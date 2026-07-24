import mongoose from "mongoose";


interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  id: string,
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
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
    },
    userId: {
      type: String,
      required: true,
    },
      orderId: {
        type: String,
      },
  },
  {
    versionKey: "version",
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

// A save must include a change for Mongoose to issue an update and increment
// the version key. Updating this timestamp ensures no-op saves are versioned.
ticketSchema.pre('save', function () {
  if (!this.isNew) {
    this.set('updatedAt', new Date());
  }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
