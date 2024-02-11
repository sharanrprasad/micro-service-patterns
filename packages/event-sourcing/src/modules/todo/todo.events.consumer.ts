import { LogClient } from "../../core/log.client";
import { TodoReadDbRepository } from "./todo.read.db.repository";
import { EventStoreClient } from "../../core/event.store.client";
import AppConstants from "../../core/app.constants";
import {
  PARK,
  PersistentSubscriptionToAll,
  PersistentSubscriptionToAllResolvedEvent,
} from "@eventstore/db-client";
import { TodoEvent, TodoEvents } from "./types/todo.event.types";
import { singleton } from "tsyringe";

@singleton()
export class TodoEventsConsumer {
  subscription: PersistentSubscriptionToAll;
  constructor(
    protected logClient: LogClient,
    protected eventStoreClient: EventStoreClient,
    protected todoRepository: TodoReadDbRepository,
  ) {
    this.subscription =
      this.eventStoreClient.eventStoreDbClient.subscribeToPersistentSubscriptionToAll(
        AppConstants.TodoSubscriptionGroupName,
      );
  }

  async listenForEvents(): Promise<void> {
    this.logClient.info("Starting todo events consumer listener");

    try {
      for await (const event of this.subscription) {
        try {
          this.logClient.info(
            `handling event ${event.event?.type} with retryCount ${event.retryCount}`,
          );
          await this.handleEvent(event);
          await this.subscription.ack(event);
        } catch (error: any) {
          await this.subscription.nack(PARK, error?.toString(), event);
        }
      }
    } catch (error) {
      this.logClient.error(`Subscription was dropped. ${error}`);
    }
  }

  async handleEvent(event: PersistentSubscriptionToAllResolvedEvent) {
    const todoEvent = event.event as TodoEvent | undefined;
    if (todoEvent) {
      switch (todoEvent.type) {
        case TodoEvents.TodoAdded || TodoEvents.TodoUpdated:
          // some kind of validation here.
          await this.todoRepository.addOrUpdateTodoItem(todoEvent.data);
          break;
      }
    }
  }

  async close() {
    this.subscription?.destroy();
  }
}
