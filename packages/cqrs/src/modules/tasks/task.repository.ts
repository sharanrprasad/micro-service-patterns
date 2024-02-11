import {AppRepository} from "../../core/ioc";
import {QueryCommand} from "@aws-sdk/lib-dynamodb";
import {TaskDbEntry} from "./tasks";
import {BaseRepository} from "../../core/base.repository";
import {AwsDynamoDbClient} from "../../core/aws.dynamo.db.client";
import {LogClient} from "../../core/log.client";

@AppRepository
export class TaskRepository extends BaseRepository {
    constructor(protected logClient: LogClient, protected dbClient: AwsDynamoDbClient) {
        super(dbClient);
    }

    async getAllTasksForUser(userId: string): Promise<TaskDbEntry[] | undefined> {
        try {
            this.logClient.info("getting tasks for user id", userId);
            const results = await this.dbClient.ddDocClient.send(
                new QueryCommand({
                    TableName: this.TableName,
                    KeyConditionExpression: '#pk = :id and begins_with(#sk, :sorter)',
                    ExpressionAttributeNames: {
                        '#pk': 'PK',
                        '#sk': 'SK'
                    },
                    ExpressionAttributeValues: {
                        ":id": userId,
                        ":sorter": 'task',
                    }
                })
            );
            return results.Items as any;
        } catch (e) {
            console.error(e);
            return undefined;
        }

    }


}