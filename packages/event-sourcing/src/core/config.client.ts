import { ApiClient } from "./api.client";
import { LogClient } from "./log.client";
import { AppApiClient } from "./ioc";
import * as process from "process";

export enum ConfigKeys {
  AWS_ACCESS_KEY_ID = "AWS_ACCESS_KEY_ID",
  AWS_SECRET_ACCESS_KEY = "AWS_SECRET_ACCESS_KEY",
  AWS_REGION = "AWS_REGION",
  DYNAMO_DB_URL = "DYNAMO_DB_URL",
  EVENT_STORE_URL = "EVENT_STORE_URL",
  EVENT_STORE_ADMIN_USERNAME = "EVENT_STORE_ADMIN_USERNAME",
  EVENT_STORE_ADMIN_PASSWORD = "EVENT_STORE_ADMIN_PASSWORD",
  GOOGLE_MAPS_API_KEY = "GOOGLE_MAPS_API_KEY",
}

@AppApiClient
export class ConfigClient extends ApiClient {
  private configValues: Map<ConfigKeys, string>;
  constructor() {
    super();
    this.configValues = new Map<ConfigKeys, string>();
  }
  async init(log: LogClient): Promise<void> {
    log.info("Initiating config service");
    // Making it async so that if need be we can read this from a key vault service.
    return new Promise((resolve) => {
      const envVariables = { ...process.env };

      Object.values(ConfigKeys).forEach((val) => {
        const envVal = envVariables[val];
        if (!envVal) {
          throw new Error("Missing config");
        }
        this.configValues.set(val, envVal);
      });

      resolve();
    });
  }

  get(key: ConfigKeys): string {
    return this.configValues.get(key) as string;
  }
}
