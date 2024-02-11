import "dotenv/config";
import express, { json, urlencoded, Express as ExpressApp } from "express";
import swaggerUi from "swagger-ui-express";
import "reflect-metadata";
import { RegisterRoutes } from "../tsoa-gen/routes";
import { container } from "tsyringe";
import { ConfigClient } from "./core/config.client";
import { LogClient } from "./core/log.client";
import { APP_API_CLIENTS_CLASS } from "./core/ioc";
import { TodoEventsConsumer } from "./modules/todo/todo.events.consumer";
const swaggerDocument = require("../tsoa-gen/swagger.json");

export class AppServer {
  public app: ExpressApp;

  constructor() {
    this.app = express();
  }

  async initClients() {
    const loggerClient = container.resolve(LogClient);
    const configClient = container.resolve(ConfigClient);

    await configClient.init(loggerClient);

    for (const clientClass of APP_API_CLIENTS_CLASS) {
      if (clientClass !== LogClient && clientClass !== ConfigClient) {
        const client = container.resolve(clientClass);
        if (client.init) {
          await client.init(loggerClient);
        }
      }
    }

    //Register listeners here. Todo -Make a separate type for this.
    try {
      const todoEventsConsumer = container.resolve(TodoEventsConsumer);
      todoEventsConsumer.listenForEvents();
      container.registerInstance(TodoEventsConsumer, todoEventsConsumer);
    } catch (e) {
      console.error(e);
    }
  }

  async init(): Promise<void> {
    // Use body parser to read sent json payloads
    this.app.use(
      urlencoded({
        extended: true,
      }),
    );
    this.app.use(json());

    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    await this.initClients();
    RegisterRoutes(this.app);
  }

  async close() {
    for (const clientClass of APP_API_CLIENTS_CLASS) {
      if (clientClass !== LogClient && clientClass !== ConfigClient) {
        const client = container.resolve(clientClass);
        if (client.close) {
          await client.close();
        }
      }
    }
  }
}
