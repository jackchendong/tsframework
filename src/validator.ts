import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    validate,
    ValidatorOptions
} from "class-validator";
import moment from "moment";
import Koa from "koa";

import { Util } from "./util";
export * from "class-validator";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import File from "formidable";

@ValidatorConstraint()
export class CustomIsInt implements ValidatorConstraintInterface {
    validate(text: any, validationArguments: ValidationArguments) {
        if (Util.isString(text)) {
            validationArguments.object[validationArguments.property] = Number(text);
            if (isNaN(validationArguments.object[validationArguments.property])) return false;
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return "($value) is not number";
    }
}

@ValidatorConstraint()
export class CustomIsString implements ValidatorConstraintInterface {
    validate(text: any, validationArguments: ValidationArguments) {
        if (Util.isNumber(text)) {
            validationArguments.object[validationArguments.property] = text.toString();
            return true;
        } else {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return "($value) is not string";
    }
}

@ValidatorConstraint()
export class CustomIsDate implements ValidatorConstraintInterface {
    validate(text: any, validationArguments: ValidationArguments) {
        if (moment(text).isValid()) {
            return false;
        } else {
            validationArguments.object[validationArguments.property] = moment(text).toDate();
            return true;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return "($value) is not Date";
    }
}

export function SchemaValidate(option: {
    schema: any;
    options?: ValidatorOptions;
    err: { message?: string } | any;
    strip?: "excludeAll" | "exposeAll";
}): MethodDecorator {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        const originFunction: Function = descriptor.value;
        descriptor.value = async function (ctx: Koa.Context, next: any) {
            try {
                // 尽量转换
                ctx.request["data"] = plainToClass(option.schema, ctx.request["data"], {
                    strategy: option.strip || "exposeAll"
                });
            } catch (error) {
                option.err["message"] = "转换失败";
                throw option.err;
            }
            const errors = await validate(ctx.request["data"], option.options);
            if (errors && errors.length) {
                // if (!errors[0].constraints) errors[0].constraints = errors[0].children as any;
                if (errors[0].constraints) {
                    option.err["message"] = Object.values(errors[0].constraints).join(" ");
                } else {
                    option.err["message"] = Object.values(errors[0].children[0].constraints).join(
                        " "
                    );
                }
                throw option.err;
            }
            // 执行原函数
            await originFunction.apply(this, arguments);
        };
    };
}
