import dotenv from "dotenv";
import { existsSync } from "fs";

const envPath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const required = ["MONGO_URI"];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

export default {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI,
};
