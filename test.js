const PORT = process.env.PORT || 8080
const { get } = require('superagent')
console.time('Heart Beat')
get('http://localhost:' + PORT + '/api/heartbeat', (err, res) => {
  if (err) console.log(err)
  else if (res.status === 200) console.log('Test Successfully passed')
  else console.log('Server is not stable status...')
  console.timeEnd('Heart Beat')
})
