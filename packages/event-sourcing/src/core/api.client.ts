import { LogClient } from "./log.client";

export abstract class ApiClient {
  init?(log: LogClient): any | Promise<any>;
  close?(): any | Promise<any>;
}
