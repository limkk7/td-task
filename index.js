const { db } = require('./db')
const inquirer = require('inquirer');


module.exports.add = async (title) => {
  const list = await db.read()
  list.push({ title, done: false })
  await db.write(list)
}
module.exports.clear = async () => {
  await db.write([])
}

module.exports.showAll = async () => {
  const list = await db.read()

  await printTasks(list)
}
async function printTasks(list) {
  const taskList = list.map((task, index) => ({
    name: `${task.done ? '[√]' : '[_]'} ${index + 1}. ${task.title}`,
    value: index.toString()
  }))
  await inquirer
    .prompt(
      {
        type: 'list',
        name: 'index',
        message: '请选择你想要操作的任务？',
        choices: [
          { name: '退出', value: '-1' },
          ...taskList,
          { name: '创建任务', value: '-2' }
        ]
      }
    )
    .then(async (answers) => {
      const index = parseInt(answers.index)
      let quitFlag = false
      if (index >= 0) {
        await askForAction(list, index)
      } else if (index === -2) {
        await askForCreateTask(list)

      } else if (index === -1) {
        quitFlag = true
      }

      if (!quitFlag) {
        list.forEach((task, index) => {
          console.log(`${task.done ? '[√]' : '[_]'} ${index + 1}. ${task.title}`)
        });
      }
    });
}
async function askForCreateTask(list) {
  await inquirer
    .prompt(
      {
        type: 'input',
        name: 'title',
        message: '请输入标题!',
      }).then(async (input) => {
        if (input.title) {
          list.push({ title: input.title, done: false })
          await db.write(list)
          const data = await db.read()
          await printTasks(data)
        }
      })
}

async function askForAction(list, index) {
  const actions = {
    markAsDone,
    markAsUndo,
    remove,
    updateTitle,
    quit
  }

  await inquirer
    .prompt(
      {
        type: 'list',
        name: 'action',
        message: '请选择你想要做操作!',
        choices: [
          { name: '退出操作', value: 'quit' },
          { name: list[index].done ? '标记未完成' : '标记已完成', value: list[index].done ? 'markAsUndo' : 'markAsDone' },
          { name: '删除', value: 'remove' },
          { name: '改标题', value: 'updateTitle' },
        ]
      }
    ).then(async (ans) => {
      const action = actions[ans.action]
      action && await action(list, index)
      console.log('2')
      if (ans.action === 'quit') {
        return
      }
      const data = await db.read()
      await printTasks(data)
    })
}
function markAsUndo(list, index) {
  list[index].done = false
  db.write(list)
}
function markAsDone(list, index) {
  list[index].done = true
  db.write(list)
}
function remove(list, index) {
  list.splice(index, 1)
  db.write(list)
}
function quit() {
  quit = true
}


async function updateTitle(list, index) {
  await inquirer
    .prompt(
      {
        type: 'input',
        name: 'title',
        message: '请输入新的标题!',
        default: list[index].title
      }).then(input => {
        if (input.title) {
          list[index].title = input.title
          db.write(list)
        }
      })
}