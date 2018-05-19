const proxy = require('express-http-proxy')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

/************************
* CONFIGURE APPLICATION *
************************/

// Configure environment to disable NODE_TLS_REJECT_UNAUTHORIZED
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/*******************************************************************
* ACQUIRE ENVIRONMENT VARIABLES FOR HOST:PORT TO PROXY REQUESTS TO *
*******************************************************************/

const API_URI = 'localhost:8080'

/**************************************************
* REGISTER PORT 8080 FOR APPLICATION TO LISTEN ON *
**************************************************/

server.listen(8080, function () {
  console.log('App listening on port 8080!')
})

/****************************************************************
* REGISTER DIRECTORY CONTENT TO BE VIEWED BY APP AS / DIRECTORY *
****************************************************************/
app.use(express.static(`${__dirname}/dist/chat-frontend`))

/****************************
* Define APIs to forward to *
****************************/

// Tell the app to proxy all requests that go through /api/transport to the apropriate service
app.use('/api/', proxy(API_URI))

/**********
* ROUTING *
**********/

app.get('/test', (req, res) => {
  res.json({message: 'test'})
})

/***********
 * SOCKETS *
 **********/

io.on('connection', (socket) => {
  console.log('user connected')

  socket.on('add-message', (message) => {
    io.emit('message', message)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

/**
* Redirect pages used by the frontend to index.html
* Assume all routes that have not previously been specified to go here
* The frontend should have a 404 page to handle routes that it is not familiar
* with.
*/
app.get('*', function (req, res) {
  res.sendFile(`${__dirname}/dist/chat-frontend/index.html`)
})
