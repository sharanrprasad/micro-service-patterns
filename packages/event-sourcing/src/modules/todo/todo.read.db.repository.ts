import { AppRepository } from "../../core/ioc";
import { BaseDynamoDbRepository } from "../../core/base.dynamo.db.repository";
import { AwsDynamoDbClient } from "../../core/aws.dynamo.db.client";
import { LogClient } from "../../core/log.client";
import { TodoReadDbItem } from "./types/todo.read.db.types";
import { TodoItem } from "./types/todo.types";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

@AppRepository
export class TodoReadDbRepository extends BaseDynamoDbRepository {
  TableName = "TodoApp";
  constructor(
    protected logClient: LogClient,
    protected dbClient: AwsDynamoDbClient,
  ) {
    super(dbClient);
  }

  static convertTodoReadDbToItem(todoReadDbItem: TodoReadDbItem): TodoItem {
    const { pk, sk, isDeleted, ...rest } = todoReadDbItem;
    return {
      id: sk,
      userId: pk,
      ...rest,
    };
  }

  static convertTodoItemToReadDbItem(todoItem: TodoItem): TodoReadDbItem {
    const { id, userId, ...rest } = todoItem;
    return {
      pk: userId,
      sk: id,
      ...rest,
    };
  }

  async addOrUpdateTodoItem(todoItem: TodoItem) {
    this.logClient.info("adding/updating to item", todoItem.id);
    const todoReadDbItem =
      TodoReadDbRepository.convertTodoItemToReadDbItem(todoItem);

    return await this.dbClient.ddDocClient.send(
      new PutCommand({
        TableName: this.TableName,
        Item: todoReadDbItem,
      }),
    );
  }

  async getAllTodosForUser(userId: string): Promise<TodoItem[]> {
    const result = await this.dbClient.ddDocClient.send(
      new QueryCommand({
        TableName: this.TableName,
        KeyConditionExpression: "pk = :pk",
        FilterExpression:
          "attribute_not_exists(isDeleted) OR isDeleted = :delValue",
        ExpressionAttributeValues: {
          ":pk": userId,
          ":delValue": false,
        },
      }),
    );

    return (result.Items as TodoReadDbItem[]).map((val) =>
      TodoReadDbRepository.convertTodoReadDbToItem(val),
    );
  }
}
