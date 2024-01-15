import {UserCommandDto} from "./user";
import {AppService} from "../../core/ioc";
import {LogClient} from "../../core/log.client";
import {UserCommandsRepository} from "./user.commands.repository";

// A post request should not contain an id.
export type UserCreationParams = UserCommandDto;

@AppService
export class UserCommandsService {
    constructor(protected logClient: LogClient, protected userCommandRepository: UserCommandsRepository) {

    }

    public async create(userCreationParams: UserCreationParams): Promise<void> {
        this.logClient.info("Create user request received", userCreationParams);
        // In CQRS once the write DB is updated an event is dispatched using Event queue like Rabbit MQ which is used by the query service to update the read database.
        await this.userCommandRepository.createUser(userCreationParams)
    }
}