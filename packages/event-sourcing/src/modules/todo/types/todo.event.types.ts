import { JSONEventType } from "@eventstore/db-client";
import { TodoItem } from "./todo.types";

export enum TodoEvents {
  TodoAdded = "TodoAdded",
  TodoUpdated = "TodoUpdated",
  TodoDeleted = "TodoDeleted",
}

export type TodoAddedEvent = JSONEventType<TodoEvents.TodoAdded, TodoItem>;

export type TodoUpdatedEvent = JSONEventType<TodoEvents.TodoUpdated, TodoItem>;

export type TodoDeletedEvent = JSONEventType<TodoEvents.TodoDeleted, TodoItem>;

export type TodoEvent = TodoAddedEvent | TodoUpdatedEvent | TodoDeletedEvent;
