import { Controller, Get, Route, SuccessResponse } from "tsoa";
import { injectable } from "tsyringe";
import { UserService } from "./user.service";

@injectable()
@Route("users")
export class UserController extends Controller {
  constructor(protected userService: UserService) {
    super();
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Get("")
  public async getUser(): Promise<void> {
    return;
  }
}
