import { Test, Expect, TestFixture, TeardownFixture } from "alsatian";
import { Timeout, TestCase, SetupFixture, Teardown, Setup, log } from "alsatian";
import Koa, { Context, Request } from "koa";
import http from "http";
import { Logger } from "../index";
import supertest from "supertest";

@TestFixture("Logger test")
export class SceneTestFixture {
    @Test("middleware")
    @Timeout(100000)
    public async middleware() {
        let app = new Koa();
        let logger = new Logger();
        app.use(logger.middleware());
        app.use(async (ctx) => {
            ctx.body = "Hello World";
        });
        let server = http.createServer(app.callback()).listen(3333);
        let instance = supertest(server);
        const response = await instance.get("/").send();
        Expect(response.text == "Hello World").toEqual(true);
    }

    @Test("info")
    @Timeout(100000)
    public info() {
        let logger = new Logger();
        let result = logger.info();
        Expect(result == undefined).toEqual(true);
    }

    @Test("success")
    @Timeout(100000)
    public success() {
        let logger = new Logger();
        let result = logger.success();
        Expect(result == undefined).toEqual(true);
    }

    @Test("error")
    @Timeout(100000)
    public error() {
        let logger = new Logger();
        let result = logger.error();
        Expect(result == undefined).toEqual(true);
    }
}
