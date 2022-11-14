import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import crypto from "crypto";
import session from "express-session";
import { fetchSSLCredentials, initialize } from "./init/init.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import serviceRouter from "./routes/services.js";
import vcsRouter from "./routes/vcs.js";
import cors from "cors";
const __dirname = dirname(fileURLToPath(import.meta.url));

try {
  credentials = fetchSSLCredentials();
} catch (err) {}
var app = express();

app.use(
  session({
    secret: crypto.randomBytes(32).toString("utf8"),
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/services", serviceRouter);
app.use("/vcs", vcsRouter);
//setupAuth(app);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});
initialize();
export default app;
