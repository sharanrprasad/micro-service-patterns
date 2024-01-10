import 'dotenv/config'
import express, {json, urlencoded, Response as ExResponse, Request as ExRequest, Express as ExpressApp} from "express";
import swaggerUi from "swagger-ui-express";
import "reflect-metadata";
import {RegisterRoutes} from "../build/routes";
import {container} from 'tsyringe';
import {ConfigClient} from "./core/config.client";
import {LogClient} from "./core/log.client";
import {APP_API_CLIENTS_CLASS} from "./core/ioc";

export class AppServer {
    public app: ExpressApp;

    constructor() {
        this.app = express();
    }

    async initClients() {
        const loggerClient = container.resolve(LogClient);
        const configClient = container.resolve(ConfigClient);
        await configClient.init(loggerClient);

        for(const clientClass of APP_API_CLIENTS_CLASS){
            if(clientClass !== LogClient && clientClass !== ConfigClient){
                const client = container.resolve(clientClass);
                if(client.init){
                    await client.init(loggerClient);
                }
            }
        }
    }

    async init(): Promise<void> {
        // Use body parser to read sent json payloads
        this.app.use(
            urlencoded({
                extended: true,
            })
        );
        this.app.use(json());

        this.app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
            return res.send(
                swaggerUi.generateHTML(await import("../build/swagger.json"))
            );
        });
        await this.initClients();
        RegisterRoutes(this.app);
    }

    async close() {
        for(const clientClass of APP_API_CLIENTS_CLASS){
            if(clientClass !== LogClient && clientClass !== ConfigClient){
                const client = container.resolve(clientClass);
                if(client.close){
                    await client.close();
                }

            }
        }
    }
}





