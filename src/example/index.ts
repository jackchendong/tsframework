import { TsFrameWork } from "../index";
import path from "path";
let app = new TsFrameWork({
    ports: [
        {
            protocol: "http",
            port: 8574
        }
    ],
    routerPath: path.resolve(__dirname, "../example/router")
});
