const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('./database/db.json')
const middlewares = jsonServer.defaults()
const fs = require('fs')
const path = require('path')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.post('/upload', upload.single('image'), function (req, res, next) {
  // req.file is the `image` file
  // req.body will hold the text fields, if there were any
  res.json(req.file)
})

server.get('/files', (req, res, next) => {
  fs.readdir('./uploads/', (err, files) => {
    if (err) return next(err)
    res.json(files)
  })
})

server.get('/files/:file_id', (req, res, next) => {
  const { file_id } = req.params
  res.set('Content-Type', 'image/jpeg')
  res.sendFile(path.join(__dirname, 'uploads/'+file_id))
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})

// Use default router
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})
