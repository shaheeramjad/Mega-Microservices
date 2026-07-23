import { beforeAll, beforeEach, afterAll } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  // eslint-disable-next-line no-var
  var signin: () => Promise<string[]>;
}

jest.unstable_mockModule('../nats-wrapper.js', () => ({
  natsWrapper: {
    client: {
      publish: jest.fn().mockImplementation(
        (...args: unknown[]) => {
          const callback = args[2];
          if (typeof callback === 'function') {
            callback();
          }
        }
      ),
    },
  },
}));

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

beforeEach(async () => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error('Database not connected');
  }

  const collections = await db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

global.signin = async (): Promise<string[]> => {
 // Build a JWT payload. { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];

};
