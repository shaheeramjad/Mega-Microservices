import {Stan} from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  protected client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      const jsonData = JSON.stringify(data);

      this.client.publish(this.subject, jsonData, (err) => {
        if (err) {
          return reject(err);
        }
        console.log(`Event published to subject ${this.subject}`);
        resolve();
      });
    });
  }
}