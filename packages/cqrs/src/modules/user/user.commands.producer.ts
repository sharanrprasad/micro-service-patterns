import {AppApiClient} from "../../core/ioc";
import {LogClient} from "../../core/log.client";
import {ApiClient} from "../../core/api.client";
import {ConfigClient, ConfigKeys} from "../../core/config.client";
import amqp, {ChannelWrapper} from 'amqp-connection-manager'
import {Db_Exchange, User_Command_Routing_Key, UserCommandDto} from "./user";
import {Channel} from "amqplib";

@AppApiClient
export class UserCommandsProducer extends ApiClient {

    private channel: ChannelWrapper | null;

    constructor(protected config: ConfigClient) {
        super();
        this.channel = null;
    }

    async init(log: LogClient): Promise<void> {
        log.info("Initiating UserCommandsProducer", this.config.get(ConfigKeys.AppQueueUrl));
        const connection = amqp.connect([this.config.get(ConfigKeys.AppQueueUrl) as string]);
        connection.on('disconnect', err => log.info('Disconnected from queue', err));
        connection.on('error', (err) => {
            // recover or exit
            log.error(err);
        });

        this.channel = connection.createChannel({
            json: true,
            setup: async (channel: Channel) => {
                return channel.assertExchange(Db_Exchange, 'topic', {durable: true});
            }
        });
        await this.channel.waitForConnect();
    }

    close(): any {
        return this.channel?.close();
    }


    async broadcastWriteDbEvent(userDto: UserCommandDto) {
        await this.channel?.publish(Db_Exchange, User_Command_Routing_Key, userDto);
    }
}