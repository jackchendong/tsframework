import { Controller, Http, Methods } from "../../http";
import Koa from "koa";
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
        methods: [Methods.GET],
        path: "/info2"
    })
    getInfo2(ctx: Koa.Context) {
        return (ctx.body = this.name);
    }
}
