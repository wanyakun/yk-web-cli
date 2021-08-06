'use strict'
// 操作命令行
const co = require('co');
const prompt = require('co-prompt');
const fs = require("fs");

const tip = require('../lib/tip');
const tpls = require('../templates');
const table = require('../lib/table');

const writeFile = (err) => {
  if (err) {
    console.log(err);
    tip.fail('请重新运行!');
    process.exit();
  }
  tip.suc('模板删除成功!');

  if (JSON.stringify(tpls) !== '{}') {
    table(tpls);
  } else {
    tip.info('还未添加模板!');
  }

  process.exit();
};

const resolve = (tplName) => {
  // 删除对应的模板
  if (tpls[tplName]) {
    delete tpls[tplName];
  } else {
    tip.fail('模板不存在!');
    process.exit();
  }

  // 写入template.json
  fs.writeFile(__dirname + '/../templates.json', JSON.stringify(tpls), 'utf-8', writeFile);
};

co(function *() {
  // 输出现有模板
  table(tpls);
  // 分步接收用户输入的参数
  const tplName = yield prompt('模板名字: ');
  return new Promise((resolve, reject) => {
    resolve(tplName);
  });
}).then(resolve);
