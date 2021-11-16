import { Controller, Http, Methods } from "../../http";
import Koa from "koa";
import { SchemaValidate } from "../../validator";

import { TestField, TestUpload } from "../schema/user";
@Controller("/user")
export default class User {
    public name: string = "xxx";

    @Http({
        methods: [Methods.GET],
        path: "/info"
    })
    getInfo(ctx: Koa.Context) {
        return (ctx.body = "hello");
    }

    @Http({
        methods: [Methods.POST],
        path: "/err"
    })
    @SchemaValidate({
        schema: TestField,
        err: { code: -1 }
    })
    getInfoErr(ctx: Koa.Context) {
        // console.log(ctx.request["data"]);
        return (ctx.body = ctx.request["data"]);
    }

    @Http({
        methods: [Methods.POST],
        path: "/upload",
        fileField: "file"
    })
    @SchemaValidate({
        schema: TestUpload,
        err: { code: -2 },
        options: {
            // forbidUnknownValues: false
            // forbidNonWhitelisted: false
            skipMissingProperties: true
        },
        strip: "excludeAll"
    })
    getInfo2(ctx: Koa.Context) {
        console.log(ctx.request["data"]);

        return (ctx.body = this.name);
    }
}
