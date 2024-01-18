import { v4 as uuid } from 'uuid';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import {BaseRepository} from "../../core/base.repository";
import {AppRepository} from "../../core/ioc";
import {UserCommandDto} from "./user";
import {AwsDynamoDbClient} from "../../core/aws.dynamo.db.client";

@AppRepository
export class UserCommandsRepository extends BaseRepository{
    constructor(protected dbClient: AwsDynamoDbClient) {
        super(dbClient);
    }
    async createUser(user: UserCommandDto){
        const id = `user#${uuid()}`;
        return await this.dbClient.ddDocClient.send(
            new PutCommand({
                TableName: this.TableName,
                Item: {
                    PK: id, // Partition Key
                    SK: id, // Sort Key
                    ...user
                },
            })
        );
    }

}
