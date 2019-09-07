const fs = require('fs')
const path = require('path').resolve()
const uuid = require('uuid/v4')

if (!fs.existsSync(path + '/DB/')) fs.mkdirSync(path + '/DB/')
if (!fs.existsSync(path + '/DB/users.json')) fs.writeFileSync(path + '/DB/users.json', '[]')
fs.writeFileSync(path + '/DB/session.json', '[]')

const userData = require(path + '/DB/users.json')
const sessions = require(path + '/DB/session.json')

exports.userList = {
  add: (id, pwHashed, res) => {
    if (!id || !pwHashed) {
      res('Params Not Completed')
    } else if (userData.filter((user) => user.id === id).length > 0) {
      res('Account Already Taken')
    } else {
      userData[userData.length] = {
        id: id,
        pw: pwHashed
      }
      fs.writeFileSync(path + '/DB/users.json', JSON.stringify(userData))
      res()
    }
  }
}

exports.sessions = {
  getSession: (id, pwHashed, res) => {
    if (!id || !pwHashed) {
      res('Params Not Completed')
    } else if (userData.filter((user) => user.id === id).length < 1) {
      res('Account not Found')
    } else {
      const userInfo = userData.filter((user) => user.id === id)[0]

      if (userInfo.id === id && userInfo.pw === pwHashed) {
        const sessionUUID = uuid()
        sessions[sessions.length] = {
          sessionId: sessionUUID,
          account: userInfo
        }
        fs.writeFileSync(path + '/DB/session.json', JSON.stringify(sessions))
        res(null, sessionUUID)
      } else {
        res('Incorrect Password')
      }
    }
  },
  checkSession: (id, sessionId, res) => {
    if (sessions.filter((session) => session.account.id === id && session.sessionId === sessionId).length > 0) {
      res()
    } else {
      res('Not Match')
    }
  }
}
