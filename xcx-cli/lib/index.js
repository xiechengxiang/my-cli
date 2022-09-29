// 命令行执行文件入口
module.exports = (actionName, actionUserInput) => {
    require("../action_modules/" + actionName + "/index.js")(actionUserInput);
}