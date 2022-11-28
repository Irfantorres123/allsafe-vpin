import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config({ path: process.env.DOTENV_PATH });
// mongodb environment variables
const { MONGO_HOSTNAME, MONGO_DB, MONGO_PORT, MONGO_USER, MONGO_PASSWORD } =
  process.env;
// mongoose options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  authSource: "auth",
};

const dbConnectionURL = {
  LOCAL_DB_URL: `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`,
  REMOTE_DB_URL: process.env.MONGODB_URI, //atlas url
};
console.log(dbConnectionURL);
mongoose.connect(dbConnectionURL.LOCAL_DB_URL, options);
export default mongoose.connection;
