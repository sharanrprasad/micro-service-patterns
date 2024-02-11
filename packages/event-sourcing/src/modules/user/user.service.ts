import { AppService } from "../../core/ioc";
import { LogClient } from "../../core/log.client";
import { UserRepository } from "./user.repository";

@AppService
export class UserService {
  constructor(
    protected logClient: LogClient,
    protected userRepository: UserRepository,
  ) {}
}
