// node dev.js (要打包的名字 -f 打包的格式) = argv.slice(2)
import minimist from "minimist";
// node中的命令参数通过 process.argv 来获取
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';
import { createRequire } from 'module';
const args = minimist(process.argv.slice(2));
const __filename = fileURLToPath(import.meta.url); // 获取文件的绝对路径
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
const target = args._[0] || 'reactivity'; // 打包哪一个项目
const format = args.f || 'iife'; // 打包过后的模块化规范
console.log(target, format);
// 入口文件
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`);
const pkg = require(`../packages/${target}/package.json`);
esbuild.context({
    entryPoints: [entry],
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    bundle: true,
    platform: "browser",
    sourcemap: true,
    format,
    globalName: pkg.buildOptions?.name
}).then((ctx) => {
    console.log('start dev');
    return ctx.watch();
})