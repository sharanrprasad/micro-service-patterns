import http from "http";
import express, { json, urlencoded } from "express";
import cors from "cors";

export class MockServer {
  server: http.Server | undefined;
  constructor() {}

  create() {
    const app = express();
    app.use(
      urlencoded({
        extended: true,
      }),
    );
    app.use(json());
    app.use(cors());
    this.server = app.listen(3004, () => {
      console.log("Mock tsoa server listening", { port: "3004" });
    });
    return this.server;
  }

  close() {
    this.server?.close();
  }
}
