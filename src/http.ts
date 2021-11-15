import Router from "koa-router";

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

export function Http(option: { methods: Methods[]; path: string }): MethodDecorator {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
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
