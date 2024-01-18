import {ApiClient} from "./api.client";
import {LogClient} from "./log.client";
import {AppApiClient} from "./ioc";


export enum ConfigKeys {
    DatabaseUrl = 'DatabaseUrl',
    AwsRegion = 'AwsRegion',
    AppQueueUrl = 'AppQueueUrl'
}

@AppApiClient
export class ConfigClient extends ApiClient {
    private configValues: Map<ConfigKeys, string>;
    constructor() {
        super();
        this.configValues = new Map<ConfigKeys, string>()
    }
    async init(log: LogClient): Promise<void> {
        log.info("Initiating config service");
        // Making it async so that if need be we can read this from a key vault service.
        return new Promise(resolve => {
            this.configValues.set(ConfigKeys.AwsRegion, 'us-west-2');
            this.configValues.set(ConfigKeys.DatabaseUrl, 'http://localhost:8000');
            this.configValues.set(ConfigKeys.AppQueueUrl, 'amqp://rabbitmq:rabbitmq@localhost:5672')
            resolve()
        })
    }

    get(key: ConfigKeys): string | undefined {
        return this.configValues.get(key);
    }

}