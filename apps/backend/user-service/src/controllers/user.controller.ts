import { Controller, Get, Route } from "tsoa";

@Route("/v1/users")
export class UserController extends Controller {
  @Get()
  public async getTest() {
    return { message: "Hello" };
  }
}
