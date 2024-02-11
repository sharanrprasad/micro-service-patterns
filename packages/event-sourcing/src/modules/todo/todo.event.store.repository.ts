import { EventStoreClient } from "../../core/event.store.client";
import { AppRepository } from "../../core/ioc";
import { BaseEventStoreRepository } from "../../core/base.event.store.repository";
import { TodoEvent } from "./types/todo.event.types";
import { TodoAggregate } from "./todo.aggregate";
import { EventData } from "@eventstore/db-client";
import AppConstants from "../../core/app.constants";

@AppRepository
export default class TodoEventStoreRepository extends BaseEventStoreRepository {
  streamPrefix = AppConstants.EventStoreTodoPrefixStream;
  constructor(protected eventStoreClient: EventStoreClient) {
    super(eventStoreClient);
  }

  async getTodoItem(id: string) {
    const events =
      this.eventStoreClient.eventStoreDbClient.readStream<TodoEvent>(
        this.getStreamName(id),
      );

    const todoAggregate = new TodoAggregate();

    for await (const resolvedEvent of events) {
      console.log(resolvedEvent);
      todoAggregate.whenResolvedEvent(resolvedEvent);
    }

    return todoAggregate;
  }

  async appendEvents(events: EventData<TodoEvent>[], todoId: string) {
    const stream = this.getStreamName(todoId);
    await this.dbClient.eventStoreDbClient.appendToStream(stream, events);
  }
}
