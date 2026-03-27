import { config } from "dotenv";
import { connectToMongo } from "./db/mongo.js";

config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

await connectToMongo(uri);
