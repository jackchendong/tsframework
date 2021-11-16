import { File } from "formidable";
import {
    validate,
    Contains,
    Length,
    Min,
    Max,
    CustomIsInt,
    CustomIsString,
    // CustomIsFormidableFile,
    CustomIsDate,
    Validate,
    IsString
} from "../../validator";

import { plainToClass, Type, Expose } from "class-transformer";
import { IsDefined, ValidateNested } from "class-validator";

export class TestField {
    @IsString()
    name: string;

    @Validate(CustomIsInt)
    age: number;
}

export class CdFile {
    @IsString()
    // 暴露属性,这样可以排除一些，用户上传的其他没有的属性
    @Expose()
    name: string;

    @Validate(CustomIsInt)
    @IsDefined()
    @Expose()
    size: number;
}

export class TestUpload {
    @Type(() => CdFile)
    @ValidateNested()
    @IsDefined()
    @Expose()
    file: CdFile;

    @Validate(CustomIsInt)
    @IsDefined()
    @Expose()
    name: string;
}

// (async () => {
//     // let user = {
//     //     title: "title，title",
//     //     text: 111,
//     //     rating: "a100",
//     //     file: { path: "xxxx", name: "xxx" }
//     // };
//     // user = plainToClass(User, user, {}) as any;
//     // console.log(user);
//     // let result: any = await validate(user, {});
//     // //console.log(result);
//     // let aaa = new User();
//     // console.log(3333, aaa instanceof User);
//     // console.log(user);
//     // console.log(typeof result.rating);
//     // console.log(typeof user.rating);
// })();
