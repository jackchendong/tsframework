import "reflect-metadata";
import Koa from "koa";
import compose from "koa-compose";
import fs from "fs";
export * from "./logger";
export * from "./util";
import http, { Server as httpServer } from "http";
import https, { Server as httpsServer } from "https";
import { Logger } from ".";
import glob from "glob";
import Router from "koa-router";
import { Controller, MetadataKey, Methods } from "./http";

export class TsFrameWork extends Koa {
    private logger = new Logger();

    constructor(opts: {
        ports: {
            port: number;
            protocol: "http" | "https";
            tls?: { cert: string; key: string };
        }[];
        middlewares?: [];
        routerPath?: string; // router 目录
    }) {
        super();
        if (opts.middlewares && opts.middlewares.length) this.use(compose(opts.middlewares));
        if (opts.routerPath) {
            glob.sync(`${opts.routerPath}/**/*.*{ts,js}`).forEach((item) => {
                let controllers = Object.values(require(item)).filter(
                    (i) => typeof i == "function"
                );
                controllers.forEach((controller: any) => {
                    let prefix = Reflect.getMetadata(MetadataKey.Controller, controller);
                    // 初始化实力，注意这里需要new 才能拿到实例里面的属性，和函数 name
                    let instance = new controller();
                    // 得到了 methodnames
                    Reflect.getMetadataKeys(instance).forEach((ele) => {
                        let obj: { path: string; methods: Methods[]; value: any } =
                            Reflect.getMetadata(ele, instance);
                        let router = new Router({
                            prefix
                        });
                        obj.methods.forEach((e) => {
                            router[e](obj.path, Reflect.get(instance, ele).bind(instance)); // 需要绑定初始化的实例
                        });
                        this.use(router.routes()).use(router.allowedMethods());
                    });
                    //参考写法
                    // const instance = new clazz();
                    // const prototype = Object.getPrototypeOf(instance);
                    // const methodsNames = Object.getOwnPropertyNames(prototype).filter(
                    //     item => Object.getOwnPropertyDescriptor(prototype, item).get == undefined && typeof prototype[item] == "function" && item != "constructor"
                    // );
                });
            });
        }

        opts.ports.forEach((ele) => {
            if (ele.protocol == "http") http.createServer(this.callback()).listen(ele.port);
            if (ele.protocol == "https")
                https
                    .createServer(
                        {
                            key: fs.readFileSync(ele.tls.key),
                            cert: fs.readFileSync(ele.tls.cert)
                        },
                        this.callback()
                    )
                    .listen(ele.port);

            this.logger.success("NODE_ENV:" + process.env.NODE_ENV);
            this.logger.success("server start at:" + ele.port);
            this.logger.success("protocol:", ele.protocol);
            if (ele.protocol == "https") this.logger.success("protocol:", ele.tls);
        });
    }
}
