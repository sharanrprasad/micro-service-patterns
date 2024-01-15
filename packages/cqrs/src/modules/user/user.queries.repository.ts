import {AppRepository} from "../../core/ioc";
import {BaseRepository} from "../../core/base.repository";
import {AwsDynamoDbClient} from "../../core/aws.dynamo.db.client";

@AppRepository
export class UserQueriesRepository extends BaseRepository{
    constructor(protected dbClient: AwsDynamoDbClient) {
        super(dbClient);
    }
}