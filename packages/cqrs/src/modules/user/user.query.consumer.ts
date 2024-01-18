import {AppApiClient} from "../../core/ioc";
import {LogClient} from "../../core/log.client";
import {ApiClient} from "../../core/api.client";
import {ConfigClient, ConfigKeys} from "../../core/config.client";
import amqp, {ChannelWrapper} from 'amqp-connection-manager'
import {Db_Exchange, User_Command_Routing_Key, UserCommandDto} from "./user";
import {Channel, ConsumeMessage} from "amqplib";

@AppApiClient
export class UserQueryConsumer extends ApiClient {

    private channel: ChannelWrapper | null;
    private queue: any;

    constructor(protected config: ConfigClient, protected log: LogClient) {
        super();
        this.channel = null;
    }

    async init(log: LogClient): Promise<void> {
        log.info("Initiating UserQueryConsumer")
        const connection = amqp.connect([this.config.get(ConfigKeys.AppQueueUrl) as string]);
        this.channel = connection.createChannel({
            json: true,
            setup: async (channel: Channel) => {
                await channel.assertExchange(Db_Exchange, 'topic', {durable: true});
                this.queue = await channel.assertQueue('', {exclusive: true})
                await channel.bindQueue(this.queue.queue, Db_Exchange, User_Command_Routing_Key);
                await channel.consume(this.queue.queue, async (msg) => {
                    return this.consumeWriteDbEvent(msg);
                }, { noAck: false})
            }
        })
        await this.channel.waitForConnect();
    }

    close(): any {
        return this.channel?.close();
    }

    async consumeWriteDbEvent(msg: ConsumeMessage | null) {
        console.log("Got a message from queue");
        if(msg){
            this.log.info(msg.fields.routingKey);
            const data: UserCommandDto = JSON.parse(msg.content.toString());
            this.log.info("data", data);
            this.channel?.ack(msg)
        }
    }
}