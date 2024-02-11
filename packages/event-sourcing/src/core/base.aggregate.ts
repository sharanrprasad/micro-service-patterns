import { EventData, EventType } from "@eventstore/db-client";

export default abstract class BaseAggregate<T extends EventType> {
  public changeEvents: EventData<T>[];
  constructor() {
    this.changeEvents = [];
  }

  protected abstract when(event: EventData<T>): void;

  protected apply(event: EventData<T>) {
    this.changeEvents.push(event);
    this.when(event);
  }
}
