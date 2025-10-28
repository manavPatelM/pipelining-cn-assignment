import fs from 'node:fs'
import path from 'node:path'

class MessageQueue {
  constructor() {
    this.queue = []
    this.queueDir = path.resolve('outbox', 'queue')
    this.processing = false
    this.maxQueueSize = 100
    this.initQueueDir()
    this.loadQueueFromDisk()
  }

  initQueueDir() {
    if (!fs.existsSync(this.queueDir)) {
      fs.mkdirSync(this.queueDir, { recursive: true })
    }
  }

  loadQueueFromDisk() {
    try {
      const queueFile = path.join(this.queueDir, 'queue.json')
      if (fs.existsSync(queueFile)) {
        const data = fs.readFileSync(queueFile, 'utf-8')
        this.queue = JSON.parse(data)
        console.log(`Loaded ${this.queue.length} messages from queue`)
      }
    } catch (error) {
      console.error('Error loading queue from disk:', error)
      this.queue = []
    }
  }

  saveQueueToDisk() {
    try {
      const queueFile = path.join(this.queueDir, 'queue.json')
      fs.writeFileSync(queueFile, JSON.stringify(this.queue, null, 2), 'utf-8')
    } catch (error) {
      console.error('Error saving queue to disk:', error)
    }
  }

  enqueue(message) {
    if (this.queue.length >= this.maxQueueSize) {
      throw new Error(`Queue is full (max ${this.maxQueueSize} messages)`)
    }

    const queueItem = {
      id: this.generateQueueId(),
      message,
      status: 'queued',
      queuedAt: new Date().toISOString(),
      attempts: 0,
      maxAttempts: 3
    }

    this.queue.push(queueItem)
    this.saveQueueToDisk()

    return queueItem
  }

  dequeue() {
    if (this.queue.length === 0) {
      return null
    }

    const item = this.queue.shift()
    this.saveQueueToDisk()
    return item
  }

  peek() {
    return this.queue.length > 0 ? this.queue[0] : null
  }

  size() {
    return this.queue.length
  }

  isEmpty() {
    return this.queue.length === 0
  }

  clear() {
    this.queue = []
    this.saveQueueToDisk()
  }

  getAll() {
    return [...this.queue]
  }

  getById(id) {
    return this.queue.find(item => item.id === id)
  }

  removeById(id) {
    const index = this.queue.findIndex(item => item.id === id)
    if (index !== -1) {
      const removed = this.queue.splice(index, 1)
      this.saveQueueToDisk()
      return removed[0]
    }
    return null
  }

  updateStatus(id, status, error = null) {
    const item = this.getById(id)
    if (item) {
      item.status = status
      item.lastUpdated = new Date().toISOString()
      if (error) {
        item.error = error
      }
      this.saveQueueToDisk()
    }
  }

  incrementAttempts(id) {
    const item = this.getById(id)
    if (item) {
      item.attempts++
      item.lastAttempt = new Date().toISOString()
      this.saveQueueToDisk()
      return item.attempts
    }
    return 0
  }

  async processQueue(processingFunction) {
    if (this.processing) {
      console.log('Queue is already being processed')
      return
    }

    this.processing = true
    console.log(`Starting queue processing. ${this.size()} messages in queue`)

    try {
      while (!this.isEmpty()) {
        const item = this.peek()
        
        if (!item) break

        console.log(`Processing message ${item.id} (attempt ${item.attempts + 1}/${item.maxAttempts})`)

        try {
          this.updateStatus(item.id, 'processing')
          
          // Process the message
          await processingFunction(item.message)
          
          // Success - remove from queue
          this.dequeue()
          console.log(`Message ${item.id} processed successfully`)
          
        } catch (error) {
          console.error(`Error processing message ${item.id}:`, error.message)
          
          const attempts = this.incrementAttempts(item.id)
          
          if (attempts >= item.maxAttempts) {
            // Max attempts reached - move to failed
            this.updateStatus(item.id, 'failed', error.message)
            this.dequeue()
            
            // Save to failed messages
            this.saveFailedMessage(item)
            console.log(`Message ${item.id} failed after ${attempts} attempts`)
          } else {
            // Retry later
            this.updateStatus(item.id, 'retry', error.message)
            console.log(`Message ${item.id} will be retried (${attempts}/${item.maxAttempts})`)
          }
        }

        // Small delay between messages
        await this.delay(100)
      }

      console.log('Queue processing completed')
    } finally {
      this.processing = false
    }
  }

  saveFailedMessage(item) {
    try {
      const failedDir = path.join(this.queueDir, 'failed')
      if (!fs.existsSync(failedDir)) {
        fs.mkdirSync(failedDir, { recursive: true })
      }

      const failedFile = path.join(failedDir, `${item.id}.json`)
      fs.writeFileSync(failedFile, JSON.stringify(item, null, 2), 'utf-8')
    } catch (error) {
      console.error('Error saving failed message:', error)
    }
  }

  generateQueueId() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const random = Math.random().toString(36).substring(2, 8)
    return `queue-${timestamp}-${random}`
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getStats() {
    const stats = {
      total: this.queue.length,
      queued: 0,
      processing: 0,
      retry: 0,
      failed: 0
    }

    this.queue.forEach(item => {
      stats[item.status] = (stats[item.status] || 0) + 1
    })

    return stats
  }
}

// Singleton instance
const messageQueue = new MessageQueue()

export default messageQueue
export { MessageQueue }
