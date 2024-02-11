import { injectable } from "tsyringe";
import { LogClient } from "../../core/log.client";
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Route,
  Security,
  SuccessResponse,
} from "tsoa";
import { TodoService } from "./todo.service";
import { AddTodoRequest } from "./types/todo.dto";
import { TodoItem } from "./types/todo.types";
import { AuthenticatedRequest } from "../../types/app.types";

@injectable()
@Route("todos")
export class TodoController extends Controller {
  constructor(
    protected logClient: LogClient,
    protected todoService: TodoService,
  ) {
    super();
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Security("jwt")
  @Post("create")
  public async createTodo(
    @Body() requestBody: AddTodoRequest,
    @Request() request: AuthenticatedRequest,
  ): Promise<TodoItem> {
    const user = request.user;
    return await this.todoService.createNewTodo(user.id, requestBody);
  }

  @Security("jwt")
  @Get("")
  public async getAllUserTodos(
    @Request() request: AuthenticatedRequest,
  ): Promise<TodoItem[]> {
    const user = request.user;
    return await this.todoService.getAllUserTodo(user.id);
  }
}
