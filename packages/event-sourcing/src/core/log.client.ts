import { ApiClient } from "./api.client";
import { AppApiClient } from "./ioc";

/*
 *  A very basic logger service. More to be added later.
 * */
@AppApiClient
export class LogClient extends ApiClient {
  info(message: string, meta?: any): void {
    console.log(message, meta || "");
  }
  warn(message: string, meta?: any): void {
    console.warn(message, meta || "");
  }
  error(message: string, meta?: any): void {
    console.error(message, meta || "");
  }
}
