import { ApiClient } from "./api.client";
import { AppApiClient } from "./ioc";
import { ConfigClient, ConfigKeys } from "./config.client";
import { EventStoreDBClient } from "@eventstore/db-client";

@AppApiClient
export class EventStoreClient extends ApiClient {
  public eventStoreDbClient: EventStoreDBClient;
  constructor(configClient: ConfigClient) {
    super();
    this.eventStoreDbClient = EventStoreDBClient.connectionString(
      configClient.get(ConfigKeys.EVENT_STORE_URL),
    );
  }
}
