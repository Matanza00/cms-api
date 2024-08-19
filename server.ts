import http from "http";
import dotenv from "dotenv";

// configuring env
dotenv.config({ path: "./.env" });

import app from "./app";

// Creating server app
const server = http.createServer(app);

const environment = process.env.NODE_ENV;
const PORT = process.env.PORT || 8080;

// Listening server
server.listen(PORT, () => {
  console.log(
    `[server]: Server is running on ${environment} mode at PORT ${PORT}`
  );
});
