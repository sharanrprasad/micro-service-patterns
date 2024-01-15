import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocument} from '@aws-sdk/lib-dynamodb';
import {ApiClient} from "./api.client";
import {ConfigClient, ConfigKeys} from "./config.client";
import {AppApiClient} from "./ioc";

@AppApiClient
export  class AwsDynamoDbClient extends ApiClient{
  public ddClient: DynamoDBClient;
  public ddDocClient: DynamoDBDocument;

  constructor(config: ConfigClient) {
      super();
       this.ddClient = new DynamoDBClient({
          region: config.get(ConfigKeys.AwsRegion) as string,
          endpoint: config.get(ConfigKeys.DatabaseUrl) as string
      });
      this.ddDocClient = DynamoDBDocument.from(this.ddClient);
  }


  close(): any {
      this.ddDocClient.destroy();
      this.ddClient.destroy();
  }
}