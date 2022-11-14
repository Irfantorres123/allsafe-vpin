#!/usr/bin/env node

/**
 * Module dependencies.
 */

import "../dbconnections/connections.js";
import app from "../app.js";
import http from "http";
import https from "https";
(async () => {
  var port = 5000;
  var host = "0.0.0.0";
  var server;
  var credentials;

  let secure = false;
  if (
    credentials !== undefined &&
    credentials.key !== undefined &&
    credentials.cert !== undefined
  ) {
    server = https.createServer(credentials, app);
    secure = true;
  } else {
    console.warn(
      "Proceeding without SSL, data will not be encrypted. Check your key and cert files"
    );
    server = http.createServer(app);
  }

  server.listen(port, host, () => {
    console.log(`Listening at ${secure ? "https" : "http"}://${host}:${port}`);
  });
})();
