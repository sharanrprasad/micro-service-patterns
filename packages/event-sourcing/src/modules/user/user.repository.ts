import { BaseDynamoDbRepository } from "../../core/base.dynamo.db.repository";
import { AppRepository } from "../../core/ioc";
import { AwsDynamoDbClient } from "../../core/aws.dynamo.db.client";

@AppRepository
export class UserRepository extends BaseDynamoDbRepository {
  TableName = "TodoApp";
  constructor(protected dbClient: AwsDynamoDbClient) {
    super(dbClient);
  }
}
