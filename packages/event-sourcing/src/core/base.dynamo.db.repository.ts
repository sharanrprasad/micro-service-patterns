import { AwsDynamoDbClient } from "./aws.dynamo.db.client";

export abstract class BaseDynamoDbRepository {
  abstract TableName: string;
  constructor(protected dbClient: AwsDynamoDbClient) {}
}
