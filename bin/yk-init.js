'use strict'
// 操作命令行
const exec = require('child_process').exec;
const co = require('co');
const ora = require('ora');
const prompt = require('co-prompt');

const tip = require('../lib/tip');
const tpls = require('../templates');
const table = require('../lib/table');
const fs = require("fs");

const spinner = ora('正在生成...');

const execRm = (err, projectName, description, author) => {
  spinner.stop();

  if (err) {
    console.log(err);
    tip.fail('请重新运行！');
    process.exit();
  }

  const data = fs.readFileSync(`${projectName}/package.json`);
  let jsonData = JSON.parse(data);
  jsonData.name = projectName;
  jsonData.version = '1.0.0';
  jsonData.description = description;
  jsonData.author = author;
  fs.writeFileSync(`${projectName}/package.json`, JSON.stringify(jsonData, null, 2), function (err) {
    if (err) {
      tip.info('write package.json error');
    }
  });
  tip.suc('初试化完成！');
  tip.info(`cd ${projectName} && npm install`);
  process.exit();
};

const download = (err, projectName, objDescription, author) => {
  if (err) {
    console.log(err);
    tip.fail('请重新运行！');
    process.exit();
  }
  // 删除git文件
  const delGitCmdStr = `cd ${projectName} && rm -rf .git`;
  exec(delGitCmdStr, (err) => {
    execRm(err, projectName, objDescription, author);
  });
  // 删除package-lock.json文件
  const delPLCmdStr = `cd ${projectName} && rm -rf package-lock.json`;
  exec(delPLCmdStr, (err) => {
    execRm(err, projectName, objDescription, author);
  });
};

const resolve = (result) => {
  const { url, branch, projectName, objDescription, author } = result;
  const cmdStr = `git clone ${url} ${projectName} && cd ${projectName} && git checkout ${branch}`;
  spinner.start();
  exec(cmdStr, (err) => {
    download(err, projectName, objDescription, author);
  });
};

co(function *() {
  // 输出现有模板
  table(tpls);
  // 处理用户输入
  const tplId = yield prompt('请从列表中选择模板id：');
  const projectName = yield prompt('项目名称：');
  const objDescription = yield prompt('项目描述：');
  const author = yield prompt('作者：');
  const keys = Object.keys(tpls);

  if (!keys[tplId]) {
    tip.fail('模板不存在！');
    process.exit();
  }
  const tplName = keys[tplId];
  return new Promise((resolve, reject) => {
    resolve({
      tplName,
      projectName,
      ...tpls[tplName],
      objDescription,
      author
    });
  });
}).then(resolve);
