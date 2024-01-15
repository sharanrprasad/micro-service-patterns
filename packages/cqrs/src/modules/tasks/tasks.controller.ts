import {injectable} from "tsyringe";
import {LogClient} from "../../core/log.client";
import {
    Controller,
    Get,
    Path,
    Route,
} from "tsoa";
import {TaskDbEntry} from "./tasks";
import {TasksService} from "./tasks.service";

@injectable()
@Route('tasks')
export class TasksController extends Controller{

    constructor(protected logClient: LogClient, protected tasksUser: TasksService) {
        super();
    }

    @Get("{userId}")
    public async getUserTasks(
        @Path() userId: string,
    ): Promise<TaskDbEntry[]> {
        const result =  await this.tasksUser.getTasksByUserId(userId) || [];
        this.logClient.info("Got tasks for user",  { userId, result} );
        return result;
    }
}