import mongoose from "mongoose";
export default async () => {
  await mongoose.connection.close();
  //Might delete database as well
  //mongoose.connection.dropDatabase();
};
