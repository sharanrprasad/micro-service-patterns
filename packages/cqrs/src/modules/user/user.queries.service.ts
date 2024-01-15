import {UserQueryDto} from "./user";
import {LogClient} from "../../core/log.client";
import {UserQueriesRepository} from "./user.queries.repository";

export class UserQueriesService {
    constructor(protected logClient: LogClient, protected userQueryRepository: UserQueriesRepository) {

    }

    public get(id: number, name?: string): UserQueryDto {
        this.logClient.info("Get user request received", {id, name});
        return {
            id,
            email: "jane@doe.com",
            name: name ?? "Jane Doe",
            status: "Employed",
        };
    }
}