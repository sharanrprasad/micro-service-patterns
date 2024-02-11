import { EventStoreClient } from "./event.store.client";

export abstract class BaseEventStoreRepository {
  abstract streamPrefix: string;
  constructor(protected dbClient: EventStoreClient) {}

  getStreamName(id: string) {
    return `${this.streamPrefix}-${id}`;
  }
}
