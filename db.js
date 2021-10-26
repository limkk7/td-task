const homedir = require('os').homedir()
const fs = require('fs')
const home = process.env.HOME || homedir
const p = require('path')
const dbPath = p.join(home, '.todo')

const db = {
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { flag: "a+" }, (e, data) => {
        if (e) {
          console.log(e)
        } else {
          let list
          try {
            list = JSON.parse(data.toString())
          } catch (error) {
            list = []
          }
          resolve(list)
        }
      })

    })
  },
  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      const string = JSON.stringify(list)
      fs.writeFile(path, string + '\n', (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })

    })
  }
}

module.exports.db = db;