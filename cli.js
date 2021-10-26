#!/usr/bin/env node

const { Command } = require('commander');
const api = require('./index.js')
const pkg = require('./package.json')

const program = new Command();

program.version(pkg.version);
program
  .option('-t, --task', 'show task list')

const options = program.opts();

program
  .command('add <taskName>')
  .description('add a task')
  .action((...args) => {
    api.add(args[0]).then(() => {
      console.log('添加成功')
    })
  });

program
  .command('clear')
  .description('clear all task')
  .action(() => {
    api.clear().then(() => console.log('清除完毕'), () => console.log('清除失败'))
  });
program
  .action(() => {
    if (process.argv.length === 2) {
      api.showAll()
    }
  });

program.parse(process.argv)
if (options.task) {
  api.showAll()
}








