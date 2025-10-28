import express from 'express'
import routes from './routes.js'
import path from 'node:path'
import fs from 'node:fs'
import { errorHandler } from './utils/errorHandler.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PUBLIC_DIR = path.resolve('public')
app.use(express.static(PUBLIC_DIR))

app.get('/', (req, res, next) => {
  const indexPath = path.join(PUBLIC_DIR, 'index.html')
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath)
  return next()
})

app.get('/transfer', (req, res, next) => {
  const transferPath = path.join(PUBLIC_DIR, 'transfer.html')
  if (fs.existsSync(transferPath)) return res.sendFile(transferPath)
  return next()
})

app.get('/outbox', (req, res, next) => {
  const outboxPath = path.join(PUBLIC_DIR, 'outbox.html')
  if (fs.existsSync(outboxPath)) return res.sendFile(outboxPath)
  return next()
})

app.get('/test-errors', (req, res, next) => {
  const testPath = path.join(PUBLIC_DIR, 'test-errors.html')
  if (fs.existsSync(testPath)) return res.sendFile(testPath)
  return next()
})

app.get('/presentation-test', (req, res, next) => {
  const presentationTestPath = path.join(PUBLIC_DIR, 'presentation-test.html')
  if (fs.existsSync(presentationTestPath)) return res.sendFile(presentationTestPath)
  return next()
})

app.get('/test-get-presentation', (req, res, next) => {
  const testGetPath = path.join(PUBLIC_DIR, 'test-get-presentation.html')
  if (fs.existsSync(testGetPath)) return res.sendFile(testGetPath)
  return next()
})

app.get('/queue', (req, res, next) => {
  const queuePath = path.join(PUBLIC_DIR, 'queue.html')
  if (fs.existsSync(queuePath)) return res.sendFile(queuePath)
  return next()
})

app.use('/api/v1/application', routes)

// Error handling middleware (must be last)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Application layer (Node) listening on http://127.0.0.1:${PORT}`)
})
