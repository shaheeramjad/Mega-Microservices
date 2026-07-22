export enum Subjects {
  TicketCreated = 'ticket:created',
  OrderCreated = 'order:created',
  OrderUpdated = 'order:updated',
  TicketUpdated = 'ticket:updated',
  ExpirationComplete = 'expiration:complete',
  PaymentCreated = 'payment:created',
}

const printSubjects = () => {
  console.log('Subjects:');
  for (const subject in Subjects) {
    if (Object.prototype.hasOwnProperty.call(Subjects, subject)) {
      console.log(`- ${subject}: ${Subjects[subject as keyof typeof Subjects]}`);
    }
  }
};

printSubjects();