import { AppService } from "../../core/ioc";
import { TodoReadDbRepository } from "./todo.read.db.repository";
import { AddTodoRequest } from "./types/todo.dto";
import TodoEventStoreRepository from "./todo.event.store.repository";
import { v4 as uuidv4 } from "uuid";
import { TodoAggregate } from "./todo.aggregate";
import { LogClient } from "../../core/log.client";
import { TodoItem } from "./types/todo.types";

@AppService
export class TodoService {
  constructor(
    protected logClient: LogClient,
    protected todoRepository: TodoReadDbRepository,
    private todoEventStoreRepository: TodoEventStoreRepository,
  ) {}

  async createNewTodo(userId: string, todoCreationParams: AddTodoRequest) {
    const newTodoId = `todo#${uuidv4()}`;
    const newTodoItem = {
      id: newTodoId,
      userId: userId,
      ...todoCreationParams,
    };

    const todoAggregate = new TodoAggregate();
    todoAggregate.applyAddTodo(newTodoItem);
    if (todoAggregate.todoItem)
      await this.todoEventStoreRepository.appendEvents(
        todoAggregate.changeEvents,
        todoAggregate.todoItem.id,
      );
    return newTodoItem;
  }

  async getAllUserTodo(userId: string): Promise<TodoItem[]> {
    this.logClient.info("Getting all todos for userId", userId);
    return this.todoRepository.getAllTodosForUser(userId);
  }
}
