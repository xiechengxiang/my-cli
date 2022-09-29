const fs = require("fs");
module.exports = (actionUserInput) => {
    /* =======判断用户输入的文字长度========== */
    if (actionUserInput.length == 0 || actionUserInput.length > 1) {
        console.log("请输入一个文件夹名");
        return;
    } else {
        // 判断文件是否存在，或者是否被使用
        let documentBool = fs.existsSync(`./${actionUserInput[0]}`);
        if (documentBool) {
            // 文件存在，看是否被占用
            let dirList = fs.readdirSync(`./${actionUserInput[0]}`);
            if (dirList.length > 0) {
                console.log("文件被占用，请重新开辟文件");
                return;
            } else {
                require("./modules/question")(actionUserInput);
            }
        } else {
            // 开始问答
            require("./modules/question")(actionUserInput);
        }
    }
}
