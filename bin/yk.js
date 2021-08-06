#! /usr/bin/env node
const program = require('commander');

program
  .version(require('../package').version)
  .usage('<command> [options]')
  .command('init', 'generate a new project from template')
  .command('list', 'list the template set')
  .command('add', 'add a template to cli config')
  .command('del', 'delete a template');

program.parse(process.argv);
