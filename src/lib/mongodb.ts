import { MongoClient, MongoClientOptions } from "mongodb";

declare const global: {
  _mongoClientPromise?: Promise<MongoClient>;
};

interface CustomMongoClientOptions extends MongoClientOptions {
  useUnifiedTopology: boolean;
  useNewUrlParser: boolean;
}

const uri: string = process.env.MONGO_URI || "";
const options: CustomMongoClientOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGO_URI) {
  throw new Error("Add Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;