import {
  EventData,
  jsonEvent,
  JSONEventData,
  ResolvedEvent,
} from "@eventstore/db-client";
import {
  TodoAddedEvent,
  TodoDeletedEvent,
  TodoEvent,
  TodoEvents,
  TodoUpdatedEvent,
} from "./types/todo.event.types";
import { TodoItem } from "./types/todo.types";
import BaseAggregate from "../../core/base.aggregate";
import { v4 as uuidv4 } from "uuid";

export class TodoAggregate extends BaseAggregate<JSONEventData<TodoEvent>> {
  public todoItem?: TodoItem;
  public isDeleted?: boolean;

  private whenTodoAdded(addedEvent: EventData<TodoAddedEvent>) {
    if (this.todoItem) {
      throw new Error("todo already initialised");
    }
    this.todoItem = addedEvent.data;
  }

  private whenTodoUpdated(addedEvent: EventData<TodoUpdatedEvent>) {
    if (!this.todoItem) {
      throw new Error("todo not initialised");
    }
    if (this.isDeleted) {
      throw new Error("todo deleted");
    }
    this.todoItem = addedEvent.data;
  }

  private whenTodoDeleted() {
    if (!this.todoItem) {
      throw new Error("todo not initialised");
    }
    this.isDeleted = true;
  }

  whenResolvedEvent(todoEvent: ResolvedEvent<TodoEvent>) {
    if (todoEvent.event) {
      this.when(todoEvent?.event as any);
    }
  }

  protected when(todoEvent: EventData<TodoEvent>) {
    switch (todoEvent.type) {
      case TodoEvents.TodoAdded:
        this.whenTodoAdded(todoEvent);
        break;
      case TodoEvents.TodoUpdated:
        this.whenTodoUpdated(todoEvent);
        break;
      case TodoEvents.TodoDeleted:
        this.whenTodoDeleted();
        break;
      default:
        throw new Error("No event type found");
    }
  }

  applyTodoUpdate(todoItem: TodoItem) {
    if (!this.isDeleted && this.todoItem) {
      const updateEvent = jsonEvent<TodoUpdatedEvent>({
        id: uuidv4(),
        type: TodoEvents.TodoUpdated,
        data: todoItem,
      });
      this.apply(updateEvent);
    }
  }

  applyDeleteTodoUpdate(todoItem: TodoItem) {
    if (!this.isDeleted && this.todoItem) {
      const deleteEvent = jsonEvent<TodoDeletedEvent>({
        id: uuidv4(),
        type: TodoEvents.TodoDeleted,
        data: todoItem,
      });
      this.apply(deleteEvent);
    }
  }

  applyAddTodo(todoItem: TodoItem) {
    if (!this.isDeleted && !this.todoItem) {
      const addTodo = jsonEvent<TodoAddedEvent>({
        id: uuidv4(),
        type: TodoEvents.TodoAdded,
        data: todoItem,
      });
      this.apply(addTodo);
    }
  }
}
