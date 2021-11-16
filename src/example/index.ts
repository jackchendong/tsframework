import { TsFrameWork } from "../index";
import path from "path";
import Body from "koa-body";
import cors from "koa2-cors";
import koa_static from "koa-static";
import ErrorHandler from "./middlewares/errorHandler";
let app = new TsFrameWork({
    ports: [
        {
            protocol: "http",
            port: 8889
        }
    ],
    routerPath: path.resolve(__dirname, "../example/router"),
    middlewares: [
        cors(),

        koa_static(__dirname + "/public"),
        ErrorHandler(),
        Body({
            multipart: true
            // formidable: {
            // 	maxFileSize: 200 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
            // }
        })
    ]
});
