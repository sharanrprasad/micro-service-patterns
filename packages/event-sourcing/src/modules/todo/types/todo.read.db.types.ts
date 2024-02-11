import { TodoItem } from "./todo.types";

export type TodoReadDbItem = Omit<TodoItem, "id" | "userId"> & {
  pk: string;
  sk: string;
  isDeleted?: boolean;
};
