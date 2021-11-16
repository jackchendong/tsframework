import Router from "koa-router";
import Koa from "koa";

let map: { [key: string]: string } = {};

export enum Methods {
    GET = "get",
    POST = "post",
    PUT = "put",
    DELETE = "delete"
}

export class MetadataKey {
    static readonly Controller: unique symbol = Symbol("Controller"); // 存储 base url 信息
}

export function Controller(baseurl = "/"): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(MetadataKey.Controller, baseurl, target);
    };
}

export function Http(option: {
    methods: Methods[];
    path: string;
    string2Json?: string | string[];
    fileField?: string | string[];
}): MethodDecorator {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        const originFunction: Function = descriptor.value; // 保存函数体
        // 重写函数体，在执行原来的函数
        descriptor.value = async function name(ctx: Koa.Context, next: any) {
            ctx.request["data"] = {};
            ctx.request["data"] = Object.assign(
                ctx.request["data"],
                ctx.request.query,
                ctx.request.body,
                ctx.request.files
            );

            if (option.string2Json) {
                if (option.string2Json instanceof Array) {
                    for (let i = 0; i < option.string2Json.length; i++) {
                        ctx.request["data"][option.string2Json[i]] = JSON.parse(
                            ctx.request["data"][option.string2Json[i]]
                        );
                    }
                } else {
                    if (ctx.request["data"][option.string2Json]) {
                        ctx.request["data"][option.string2Json] = JSON.parse(
                            ctx.request["data"][option.string2Json]
                        );
                    }
                }
            }

            if (option.fileField) {
                if (option.fileField instanceof Array) {
                    for (let i = 0; i < option.fileField.length; i++) {
                        if (ctx.request["data"][option.fileField][i].length) {
                            // 多个文件上传
                            for (
                                let j = 0;
                                j < ctx.request["data"][option.fileField][i].length;
                                j++
                            ) {
                                let element = ctx.request["data"][option.fileField][i][j];
                                element = {
                                    name: ctx.request["data"][option.fileField][i][j].name,
                                    size: ctx.request["data"][option.fileField][i][j].size,
                                    path: ctx.request["data"][option.fileField][i][j].path
                                };
                            }
                        } else {
                            ctx.request["data"][option.fileField][i] = {
                                name: ctx.request["data"][option.fileField][i].name,
                                size: ctx.request["data"][option.fileField][i].size,
                                path: ctx.request["data"][option.fileField][i].path
                            };
                        }
                    }
                } else {
                    if (ctx.request["data"][option.fileField].length) {
                        // 多个文件上传
                        for (let j = 0; j < ctx.request["data"][option.fileField].length; j++) {
                            let element = ctx.request["data"][option.fileField][j];
                            element = {
                                name: ctx.request["data"][option.fileField][j].name,
                                size: ctx.request["data"][option.fileField][j].size,
                                path: ctx.request["data"][option.fileField][j].path
                            };
                        }
                    } else {
                        ctx.request["data"][option.fileField] = {
                            name: ctx.request["data"][option.fileField].name,
                            size: ctx.request["data"][option.fileField].size,
                            path: ctx.request["data"][option.fileField].path
                        };
                    }
                }
            }
            // 执行原来的函数
            await originFunction.apply(this, arguments);
        };

        // 存储 path methods 和 函数体，这里用 函数名 key 存储，后面 反射可以获得函数名，之后取出来
        Reflect.defineMetadata(
            key, // 函数名
            {
                path: option.path,
                methods: option.methods
            },
            target // class 实体
        );
    };
}
