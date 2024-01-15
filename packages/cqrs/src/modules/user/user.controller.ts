import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Route,
    SuccessResponse,
} from "tsoa";
import {UserQueryDto} from "./user";
import {UserCreationParams} from "./user.commands.service";
import { injectable } from 'tsyringe';
import {UserCommandsService} from "./user.commands.service";
import {UserQueriesService} from "./user.queries.service";


@injectable()
@Route("users")
export class UserController extends Controller {

    constructor(protected userCommandsService: UserCommandsService, protected userQueriesService: UserQueriesService) {
        super();
    }

    @Get("{userId}")
    public async getUser(
        @Path() userId: number,
        @Query() name?: string
    ): Promise<UserQueryDto> {
        return this.userQueriesService.get(userId, name);
    }

    @SuccessResponse("201", "Created") // Custom success response
    @Post()
    public async createUser(
        @Body() requestBody: UserCreationParams
    ): Promise<void> {
        this.setStatus(201); // set return status 201
        await this.userCommandsService.create(requestBody);
        return;
    }
}