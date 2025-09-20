import { MongoClient } from "mongodb";

declare global {
  var mongoClient: {
    client: MongoClient | null;
    promise: Promise<MongoClient> | null;
  };
}
