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
import {User} from "./user";
import {UserService, UserCreationParams} from "./user.service";
import { injectable } from 'tsyringe';


@injectable()
@Route("users")
export class UserController extends Controller {

    constructor(private userService: UserService) {
        super();
    }

    @Get("{userId}")
    public async getUser(
        @Path() userId: number,
        @Query() name?: string
    ): Promise<User> {
        return this.userService.get(userId, name);
    }

    @SuccessResponse("201", "Created") // Custom success response
    @Post()
    public async createUser(
        @Body() requestBody: UserCreationParams
    ): Promise<void> {
        this.setStatus(201); // set return status 201
        this.userService.create(requestBody);
        return;
    }
}