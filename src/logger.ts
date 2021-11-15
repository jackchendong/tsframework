import chalk from "chalk";
import moment from "moment";
import * as asyncHooks from "async_hooks";
import { v1 as uuid } from "uuid";
import { Context, Request } from "koa";

let store = new Map();
store.set(0, "主进程");

function init_async(asyncId: number, type: string, triggerId: number, resource: Object) {
    if (triggerId && store.has(triggerId)) {
        store.set(asyncId, store.get(triggerId));
    } else {
        store.set(asyncId, uuid());
    }
}

function destroy(asyncId: number) {
    store.delete(asyncId);
}

export class Logger {
    private static instance: boolean;

    constructor() {
        if (!Logger.instance) {
            const asyncHook = asyncHooks.createHook({ init: init_async, destroy });
            asyncHook.enable();
            Logger.instance = true;
        }
    }

    middleware() {
        return (ctx: Context, next: Function) => {
            ctx.set("X-Request-Id", store.get(asyncHooks.executionAsyncId()));
            next();
        };
    }

    info(...args) {
        console.log(
            chalk.yellow(
                `[${store.get(asyncHooks.executionAsyncId())}] [${moment().format(
                    "YYYY-MM-DD"
                )}] [${moment().format("HH:mm:ss")}] `
            ),
            ...args
        );
    }

    success(...args) {
        console.log(
            chalk.green(
                `[${store.get(asyncHooks.executionAsyncId())}] [${moment().format(
                    "YYYY-MM-DD"
                )}] [${moment().format("HH:mm:ss")}] `
            ),
            ...args
        );
    }

    error(...args) {
        console.log(
            chalk.red(
                `[${store.get(asyncHooks.executionAsyncId())}}] [${moment().format(
                    "YYYY-MM-DD"
                )}] [${moment().format("HH:mm:ss")}] `
            ),
            ...args
        );
    }
}
