process.env.DOTENV_PATH = "./config.env.test";
import connection from "../dbconnections/connections";
(async () => {
  await connection.asPromise();
  console.log("Connected to database");
})();
