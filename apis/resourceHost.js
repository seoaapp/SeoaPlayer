const fs = require('fs')
const path = require('path').resolve()

if (!fs.existsSync(path + '/res/')) fs.mkdirSync(path + '/res')
fs.writeFileSync(path + '/DB/session.json', '[]')

const sessions = require(path + '/DB/session.json')

exports.up = (sessionId, files, res) => {
  if (!sessionId || !files) {
    res('Params Not Completed')
  } else if (sessions.filter((session) => session.sessionId === sessionId).length > 0) {
    const file = files.uploadFile

    if (fs.existsSync(path + '/res/' + file.name)) { res('File already exist') } else {
      file.mv(path + '/res/' + file.name)
      res()
    }
  } else {
    res('session not authorized')
  }
}

exports.down = (sessionId, filename, res) => {
  if (!sessionId || !filename) {
    res.status(403).send('Params Not Completed')
  } else if (!fs.existsSync(path + '/res/' + filename)) {
    res.status(404).send('File not Found')
  } else if (sessions.filter((session) => session.sessionId === sessionId).length > 0) {
    res.sendFile(path + '/res/' + filename)
  } else {
    res.status(403).send('session not authorized')
  }
}
