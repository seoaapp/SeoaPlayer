/*

  ███████╗███████╗ ██████╗  █████╗ ██████╗ ██╗      █████╗ ██╗   ██╗███████╗██████╗
  ██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗
  ███████╗█████╗  ██║   ██║███████║██████╔╝██║     ███████║ ╚████╔╝ █████╗  ██████╔╝
  ╚════██║██╔══╝  ██║   ██║██╔══██║██╔═══╝ ██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗
  ███████║███████╗╚██████╔╝██║  ██║██║     ███████╗██║  ██║   ██║   ███████╗██║  ██║
  ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
  Copyright (c) 2019 Seoa Development Team. MIT Licensed.
*/

/**
 * @name Seoa
 * @description SeoaPlayer-api
 * @license MIT
 * @author Seoa Development Team
 * @version 0.1.0
 */

'use strict'

const PORT = process.env.PORT || 8080
const ejs = require('ejs')
const cors = require('cors')
const chalk = require('chalk')
const express = require('express')
const authHost = require('./apis/authHost')
const resHost = require('./apis/resourceHost')
const fileUpload = require('express-fileupload')

const app = express()
app.use(cors())
app.use(fileUpload())

app.get('/auth/:proc/:param1/:param2', (req, res) => {
  switch (req.params.proc) {
    case 'join':
      authHost.userList.add(req.params.param1, req.params.param2, (err) => {
        if (err) res.status(403).send(err)
        else res.sendStatus(200)
      })
      break

    case 'signin':
      authHost.sessions.getSession(req.params.param1, req.params.param2, (err, sessionId) => {
        if (err) res.status(403).send(err)
        else res.send({ accountId: req.params.param1, sessionId: sessionId })
      })
      break

    case 'check':
      authHost.sessions.checkSession(req.params.param1, req.params.param2, (err) => {
        if (err) res.status(403).send(err)
        else res.sendStatus(200)
      })
      break

    default:
      res.sendStatus(404)
      break
  }
})

app.post('/res/upload/:sessionId', (req, res) => {
  resHost.up(req.params.sessionId, req.files, (err) => {
    if (err) res.status(403).send(err)
    else res.sendStatus(200)
  })
})

app.get('/res/upload/:sessionId', (req, res) => {
  ejs.renderFile('./page/upload.ejs', { PORT: PORT, sessionId: req.params.sessionId }, (err, str) => {
    if (err) res.status(401).send(err)
    else res.send(str)
  })
})

app.get('/res/download/:sessionId/:filename', (req, res) => {
  resHost.down(req.params.sessionId, req.params.filename, res)
})

app.get('/api/heartbeat', (req, res) => {
  res.sendStatus(200)
})

app.listen(PORT, () => {
  console.log(chalk.blue('Seoa Player Server is now on ') + chalk.blue.bold('http://localhost:') + chalk.yellow.bold(PORT) + chalk.blue.bold('/'))
})
