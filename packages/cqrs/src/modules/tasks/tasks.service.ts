import {AppService} from "../../core/ioc";
import {TaskRepository} from "./task.repository";

@AppService
export class TasksService {

    constructor(protected tasksRepository: TaskRepository) {
    }

    async getTasksByUserId(userId:string){
        return this.tasksRepository.getAllTasksForUser(userId);

    }

}