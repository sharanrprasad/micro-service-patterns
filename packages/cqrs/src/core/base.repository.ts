import {AwsDynamoDbClient} from "./aws.dynamo.db.client";

export abstract class BaseRepository {
    TableName = 'TasksApp'
    constructor(protected dbClient: AwsDynamoDbClient) {
    }

}