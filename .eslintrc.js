module.exports = {
    //此项是用来告诉eslint找当前配置文件不能往父级查找
    root: true,
    //此项是用来指定eslint解析器的，解析器必须符合规则，babel-eslint解析器是对babel解析器的包装使其与ESLint解析
    parser: '@typescript-eslint/parser',
    // 此项是用来提供插件的，插件名称省略了eslint - plugin -，下面这个配置是用来规范html的
    plugins: ['@typescript-eslint'],
    // 此项是用来指定javaScript语言类型和风格，sourceType用来指定js导入的方式，默认是script，此处设置为module，指某块导入方式
    parserOptions: {
        "ecmaVersion": 6,//也就是ES6语法支持的意思
        "sourceType": "module",
        "ecmaFeatures": {
            "modules": true
        },
        "project": "./tsconfig.json"
    },
    //此项指定环境的全局变量，下面的配置指定为浏览器环境
    env: {
        node: true,
    },
    globals: {
        // gTool: true, // 例如定义gTool这个全局变量，且这个变量可以被重写
    },
    rules: {
        "semi": "error",
        // 禁止使用 var
        'no-var': "error",
        // 优先使用 interface 而不是 type
        '@typescript-eslint/consistent-type-definitions': [
            "error",
            "interface"
        ],
        'no-console': 'off', // 禁用no-console规则
        "no-multiple-empty-lines": [2, { "max": 1 }]
    }
}