const Table = require('cli-table');

const tip = require('./tip');

module.exports = (config) => {
  const table = new Table({
    head: ['id', 'name', 'description',],
    style: {
      head: ['cyan']
    }
  });

  const keys = Object.keys(config);

  if (keys.length) {
    keys.forEach((key, index) => {
      table.push(
        [`${index}`, `${key}`, config[key].description]
      );
    });
    const list = table.toString();
    if (list) {
      tip.info('templates: ');
      console.log(`${list}\n`);
    } else {
      tip.fail('模板不存在！');
    }
  } else {
    tip.fail('模板不存在！');
  }
};
