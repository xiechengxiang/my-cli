const inquirer = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");
const fs = require("fs");
const { default: axios } = require("axios");
const download = require("download-git-repo");
const package = require("../../../package.json");
module.exports = (actionUserInput) => {
    const projectNameList = []; // 仓库名称
    const giteeUrlList = []; // 仓库地址

    /* =======判断是否出现====== */
    function when(answer) {
        if (answer.startbool === true) {
            return true;
        } else {
            return false;
        }
    }

    /* =======获取仓库======== */
    async function choices(answer) {
        let url = "https://gitee.com/api/v5/user/repos";
        let access_token = answer.access_token;
        return await axios({
            method: "GET",
            url,
            params: {
                access_token: access_token,
                visibility: "all",
                sort: "full_name",
                page: "1",
                per_page: "20",
            },
        })
            .then(({ data }) => {
                let choicesList = data.map((item) => {
                    projectNameList.push(item.name);
                    giteeUrlList.push(item.html_url);
                    return item.name;
                });
                return choicesList;
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const question = [
        {
            type: "confirm",
            name: "startbool",
            message: "是否创建一个项目：",
            default: false,
        },
        {
            type: "input",
            name: "author",
            message: "请输入你的姓名：",
            default: "宇宙超级无敌马牛逼",
            when: when,
        },
        {
            type: "input",
            name: "description",
            message: "请输入对该项目的描述：",
            default: "简单的脚手架创建",
            when: when,
        },
        {
            type: "input",
            name: "access_token",
            message: "请输入gitee的私人令牌：",
            default: "77a86e993fe311d168643d5038c220df",
            when: when,
        },
        {
            type: "list",
            name: "projectCloneName",
            message: "请选择你要创建的项目：",
            choices: choices,
            when: when,
        }
    ];
    /* =======改变基础信息======= */
    function changePackage(answer) {
        let newAnswer = { ...package, ...answer, startbool: undefined, projectCloneName: undefined };
        fs.writeFileSync("./package.json", JSON.stringify(newAnswer));
    }

    /* =======下载相关模板========= */
    function downloadFunc(answer) {
        // 加载中动画
        const spinner = ora("开始拉取..").start();
        setTimeout(() => {
            spinner.color = "red";
            spinner.text = "拉取中";
        }, 1000);
        // 确定拉取地址
        let cloneUrl = null;
        if (answer.projectCloneName) {
            let i = projectNameList.indexOf(answer.projectCloneName);
            cloneUrl = giteeUrlList[i];
        }
        // 开始拉取
        download(`direct:${cloneUrl}`, `./${actionUserInput[0]}/${answer.projectCloneName}`, { clone: true }, function (err) {
            if (err) {
                spinner.fail("拉取失败");
            } else {
                spinner.succeed("拉取成功");
            }
        })
    }

    inquirer
        .prompt(question)
        .then((answer) => {
            changePackage(answer);
            downloadFunc(answer);
        })
        .catch((err) => {
            console.log(err);
        });
}
