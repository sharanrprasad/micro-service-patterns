import {User} from "./user";
import {AppService} from "../../core/ioc";
import {LogClient} from "../../core/log.client";
import {ConfigClient} from "../../core/config.client";

// A post request should not contain an id.
export type UserCreationParams = Pick<User, "email" | "name" | "phoneNumbers">;

@AppService
export class UserService {
    constructor(public logClient: LogClient, public configClient: ConfigClient) {

    }

    public get(id: number, name?: string): User {
        this.logClient.info("Get user request received", {id, name});
        return {
            id,
            email: "jane@doe.com",
            name: name ?? "Jane Doe",
            status: "Employed",
            phoneNumbers: [],
        };
    }

    public create(userCreationParams: UserCreationParams): User {
        this.logClient.info("Create user request received", userCreationParams);
        return {
            id: Math.floor(Math.random() * 10000), // Random
            status: "Retired",
            ...userCreationParams,
        };
    }
}