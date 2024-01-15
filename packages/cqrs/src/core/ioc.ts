import { singleton } from 'tsyringe';
import {ApiClient} from "./api.client";

// This is the way to define a constructor function. Another simle example would be -
// type MyConstructorType = new (name: string, age: number) => any;
// The below basically means any class.
export type Constructor<T> = {
    new (...args: any[]): T;
};

export const APP_API_CLIENTS_CLASS: Constructor<ApiClient>[]  = [];

export function AppApiClient<T extends ApiClient>(target: Constructor<T>) {
    // Bind service as a singleton injectable
    singleton()(target);

    // Add to list of services to have their lifecycle managed
    APP_API_CLIENTS_CLASS.push(target);
}


export function AppService<T extends any>(target: Constructor<T>) {
    // Bind service as a singleton injectable
    singleton()(target);
}


export function AppRepository<T extends any>(target: Constructor<T>) {
    // Bind service as a singleton injectable
    singleton()(target);
}
