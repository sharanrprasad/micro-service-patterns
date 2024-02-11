import { TodoItem, TodoLocation, TodoStatus } from "./todo.types";

export type AddTodoRequest = {
  /**
   * @isString title must be a string
   */
  title: string;
  status: TodoStatus;
  location: TodoLocation;
};

export type UpdateTodoRequest = TodoItem;
