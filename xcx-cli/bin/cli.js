#!/usr/bin/env node
const { program } = require("commander");
const version = require("../package.json").version;

/* =======定义命令======= */
const actionMap = {
    // 命令create
    create: {
        alias: "crt", // 缩写
        des: "创建一个项目", // 描述
        examples: ["xcx-cli create demo-name", "xcx-cli crt demo-name"],
    },
    config: {
        alias: "cfg",
        des: "对项目进行配置",
        examples: ["xcx-cli config demo-name", "xcx-cli cfg demo-name"],
    },
};

/* =======循环创建命令======= */
Object.keys(actionMap).forEach((item) => {
    program.command(item)
        .alias(actionMap[item].alias)
        .description(actionMap[item].des)
        .action(() => {
            let actionName = item;
            let actionUserInput = process.argv.slice(3);
            require("../lib/index")(actionName, actionUserInput);
        });
});

/* ======监听--help事件====== */
program.on("--help", () => {
    console.log("\n");
    console.log("Example:");
    Object.keys(actionMap).forEach((item) => {
        actionMap[item].examples.forEach((itemList) => {
            console.log("  " + itemList);
        })
    })
})

program
    .version(version) // 版本号命令 -V
    .parse(process.argv);