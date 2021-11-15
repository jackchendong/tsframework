export class Util {
    /***************************************************************************************************************************************************** */
    /**
     * 判断string类型
     * @param input
     */
    static isString(input: any): boolean {
        return Object.prototype.toString.call(input) == "[object String]";
    }

    /**
     *  判断array类型
     * @param input
     */
    static isArray(input: any): boolean {
        return Object.prototype.toString.call(input) == "[object Array]";
    }
    /***************************************************************************************************************************************************** */
    /**
     * 检查手机号
     * @param phone
     */
    static checkPhone(phone: string): boolean {
        return /^1\d{10}$/.test(phone);
    }

    /**
     * 检查邮箱
     * @param email
     */
    static checkEmail(email: string): boolean {
        return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email);
    }
    /***************************************************************************************************************************************************** */
    /**
     * 字符串随机
     * @param length
     */
    static randomStr(length: number): string {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let noceStr = "",
            maxPos = chars.length;
        while (length--) noceStr += chars[(Math.random() * maxPos) | 0];
        return noceStr;
    }

    /**
     * 数字随机
     * @param length
     */
    static randomNumStr(length: number): string {
        const chars = "0123456789";
        let noceStr = "",
            maxPos = chars.length;
        while (length--) noceStr += chars[(Math.random() * maxPos) | 0];
        return noceStr;
    }
    /***************************************************************************************************************************************************** */
    /**
     * 数组取并集
     */
    static arrayUnionMany(input: Array<Array<any>>): any[] {
        if (input.length == 1) {
            return input[0];
        } else {
            let base: any = [];
            input.forEach((item) => {
                base = base.concat(item);
            });
            let res = new Set(base);
            return Array.from(res);
        }
    }

    /**
     * 多个数组取交集
     * @param input 输入
     */
    static arrayIntersectionMany(input: Array<Array<any>>): any[] {
        if (input.length == 1) {
            return input[0];
        } else if (input.length == 2) {
            return this.arrayIntersectionBy2(input[0], input[1]);
        } else {
            let res: any = [];
            let base = input[0];
            base.forEach((item) => {
                let some = 0;
                for (let i = 1; i < input.length; i++) {
                    input[i].some((tmp) => {
                        return tmp == item;
                    }) && some++;
                }
                some == input.length - 1 && res.push(item);
            });
            return res;
        }
    }

    /**
     * 2个数组取交集 指针法
     */
    static arrayIntersectionBy2(input1: Array<any>, input2: Array<any>): any[] {
        let res = new Set();
        let p = 0,
            q = 0;
        input1 = input1.sort();
        input2 = input2.sort();
        while (p < input1.length && q < input2.length) {
            if (input1[p] < input2[q]) {
                p++;
            } else if (input2[q] < input1[p]) {
                q++;
            } else {
                res.add(input1[p]);
                p++;
                q++;
            }
        }
        return Array.from(res);
    }

    /**
     * 2个数组取补集
     */
    static arrayComplementBy2(input1: any[], input2: any[]): any[] {
        return input1
            .filter((e) => {
                return !(input2.indexOf(e) > -1);
            })
            .concat(
                input2.filter((e) => {
                    return !(input1.indexOf(e) > -1);
                })
            );
    }

    /**
     *  平级数组
     * @param input
     */
    static arrayFlatten(input: Array<any>): any[] {
        const stack = [...input];
        const res: any = [];
        while (stack.length) {
            const next = stack.pop();
            if (Array.isArray(next)) {
                stack.push(...next);
            } else {
                res.push(next);
            }
        }
        return res.reverse();
    }

    /***************************************************************************************************************************************************** */
    static regGetString(input: string): string {
        let fbsArr = ["\\", "$", "^", "?", "+", "*", ".", "(", ")", "{", "}", "[", "]", "|", "/"];
        let tmp = "";
        for (let i = 0; i < input.length; i++) {
            tmp += fbsArr.includes(input[i]) ? `\\${input[i]}` : input[i];
        }
        return tmp;
    }
}
