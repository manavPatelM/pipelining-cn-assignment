import { Router } from 'express'
import multer from 'multer'
import fs from 'node:fs'
import path from 'node:path'
import { writeEnvelope } from './services/outbox.js'
import { saveTransferLog, listTransfers } from './controllers/transferController.js'
import messageQueue from './services/messageQueue.js'
import { 
  validateFile, 
  ValidationError, 
  FileError,
  FILE_VALIDATION 
} from './utils/errorHandler.js'

// Configure multer with file size limit
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: FILE_VALIDATION.MAX_FILE_SIZE, // 100MB
    files: 1
  }
})
const router = Router()

router.get('/', (req, res) => {
  res.set('Content-Type', 'text/html')
  res.send(`<!doctype html>
<html><body style="font-family: system-ui; padding: 24px;">
  <h2>Application Layer - Input</h2>
  <form action="/api/v1/application/ui/submit" method="post" enctype="multipart/form-data">
    <div><label>Sender <input name="sender" required></label></div>
    <div><label>Receiver <input name="receiver" required></label></div>
    <div><label>Message <input name="message"></label></div>
    <div><label>File <input type="file" name="file"></label></div>
    <div><label>Format
      <select name="format">
        <option value="json" selected>json</option>
        <option value="xml">xml</option>
      </select>
    </label></div>
    <button type="submit">Save to Outbox</button>
  </form>
  <p>Outbox dir: outbox</p>
</body></html>`)
})

router.post('/ui/submit', upload.single('file'), (req, res) => {
  try {
    const { sender, receiver, senderIP, receiverIP, message, format, protocol, transferMode, chunkSize } = req.body
    
    // Validate required fields
    if (!sender || !receiver) {
      throw new ValidationError('Sender and receiver are required')
    }
    
    if (!message && !req.file) {
      throw new ValidationError('Either message or file is required')
    }

    // Validate file if present
    if (req.file) {
      validateFile(req.file)
    }

    let fileInfo = null
    if (req.file) {
      const outDir = path.resolve('outbox', 'uploads')
      fs.mkdirSync(outDir, { recursive: true })
      
      // Sanitize filename
      const sanitizedName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = path.join(outDir, sanitizedName)
      
      fs.writeFileSync(filePath, req.file.buffer)
      fileInfo = { 
        path: filePath, 
        name: req.file.originalname,
        sanitized_name: sanitizedName,
        size_bytes: req.file.size,
        mime_type: req.file.mimetype
      }
    }
    
    const envelope = {
      headers: { sender, receiver },
      content: { message: message || null, file: fileInfo },
      preferences: { format: (format || 'json').toLowerCase() },
      meta: { created_at: new Date().toISOString(), schema: 'application.input.v1' }
    }
    
    const p = writeEnvelope(envelope)
    
    // Also save transfer record for history
    saveTransferRecord(sender, receiver, senderIP, receiverIP, message, req.file, protocol, transferMode, chunkSize)
    
    res.status(201).send(`Saved to ${p}. You can close this tab.`)
  } catch (error) {
    console.error('Error in ui/submit:', error)
    
    if (error instanceof ValidationError || error instanceof FileError) {
      return res.status(error.statusCode).send(`Error: ${error.message}`)
    }
    
    res.status(500).send('Error: Internal server error')
  }
})

function saveTransferRecord(sender, receiver, senderIP, receiverIP, message, file, protocol = 'http', mode = 'binary', chunkSize = 32) {
  try {
    const transferLogDir = path.resolve('outbox', 'transfers')
    fs.mkdirSync(transferLogDir, { recursive: true })
    
    const dataSize = file ? file.size : (message ? Buffer.from(message).length : 0)
    const fileName = file ? file.originalname : 'message.json'
    
    const transferRecord = {
      protocol: (protocol || 'http').toUpperCase(),
      timestamp: new Date().toISOString(),
      source: {
        host: sender,
        ip: senderIP || sender,
        port: protocol === 'ftp' ? 21 : (protocol === 'https' ? 443 : 3000)
      },
      destination: {
        host: receiver,
        ip: receiverIP || receiver,
        port: protocol === 'ftp' ? 21 : (protocol === 'https' ? 443 : 3000)
      },
      file: {
        name: fileName,
        size: dataSize,
        path: file ? path.relative(process.cwd(), path.join('outbox', 'uploads', file.originalname)) : null,
        mode: mode || 'binary'
      },
      transfer: {
        duration_seconds: Math.ceil(dataSize / (50 * 1024)), // Simulated duration
        average_speed_kbps: 50,
        status: 'completed',
        chunks_sent: Math.ceil(dataSize / ((chunkSize || 32) * 1024))
      },
      protocol_details: protocol === 'ftp' ? {
        mode: mode === 'binary' ? 'TYPE I' : 'TYPE A',
        transfer_mode: 'PASV',
        connection: 'binary',
        ftp_code: 226
      } : {
        method: 'POST',
        endpoint: '/api/v1/application/ui/submit',
        content_type: 'multipart/form-data',
        response_code: 201
      },
      meta: {
        created_at: new Date().toISOString(),
        schema: 'message_composer_transfer.v1',
        has_message: !!message,
        has_file: !!file
      }
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const logFileName = `${timestamp}-${protocol || 'http'}-composer.json`
    const logFilePath = path.join(transferLogDir, logFileName)
    
    fs.writeFileSync(logFilePath, JSON.stringify(transferRecord, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error saving transfer record:', error)
  }
}

// Transfer simulation routes
router.post('/transfer/save', upload.single('file'), saveTransferLog)
router.get('/transfer/list', listTransfers)

// List all envelopes in outbox
router.get('/outbox/list', (req, res) => {
  try {
    const outboxDir = path.resolve('outbox')
    const files = fs.readdirSync(outboxDir)
    
    const envelopes = files
      .filter(f => f.endsWith('.json'))
      .map(f => {
        try {
          const content = JSON.parse(fs.readFileSync(path.join(outboxDir, f), 'utf-8'))
          return {
            id: f.replace('.json', ''),
            filename: f,
            sender: content.headers?.sender || 'unknown',
            receiver: content.headers?.receiver || 'unknown',
            created: content.meta?.created_at || null,
            hasFile: !!content.content?.file,
            hasMessage: !!content.content?.message
          }
        } catch (err) {
          return null
        }
      })
      .filter(e => e !== null)
      .sort((a, b) => new Date(b.created) - new Date(a.created))

    res.json({
      success: true,
      count: envelopes.length,
      envelopes
    })
  } catch (error) {
    console.error('Error listing envelopes:', error)
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to list envelopes',
        code: 'INTERNAL_ERROR'
      }
    })
  }
})

// API endpoint to send data to Presentation layer
router.post('/send-to-presentation', upload.single('file'), async (req, res) => {
  try {
    const { sender, receiver, senderIP, receiverIP, message, format, protocol, transferMode, chunkSize } = req.body
    
    // Validate required fields
    if (!sender || !receiver) {
      throw new ValidationError('Sender and receiver are required')
    }
    
    if (!message && !req.file) {
      throw new ValidationError('Either message or file is required')
    }

    // Validate file if present
    if (req.file) {
      validateFile(req.file)
    }

    // Prepare data for Presentation layer
    const presentationData = {
      layer: 'application',
      timestamp: new Date().toISOString(),
      session: {
        source: {
          host: sender,
          ip: senderIP || sender,
          port: protocol === 'https' ? 443 : (protocol === 'ftp' ? 21 : 3000)
        },
        destination: {
          host: receiver,
          ip: receiverIP || receiver,
          port: protocol === 'https' ? 443 : (protocol === 'ftp' ? 21 : 3000)
        }
      },
      protocol: {
        type: (protocol || 'http').toUpperCase(),
        version: protocol === 'ftp' ? 'RFC 959' : '1.1'
      },
      data: {
        content_type: req.file ? req.file.mimetype : 'text/plain',
        encoding: transferMode || 'binary',
        format: format || 'json',
        size_bytes: req.file ? req.file.size : (message ? Buffer.from(message).length : 0),
        payload: {
          message: message || null,
          file: req.file ? {
            name: req.file.originalname,
            size: req.file.size,
            type: req.file.mimetype
          } : null
        }
      },
      transfer_config: {
        mode: transferMode || 'binary',
        chunk_size_kb: parseInt(chunkSize) || 32,
        compression: false,
        encryption: protocol === 'https'
      },
      meta: {
        schema: 'application_to_presentation.v1',
        layer_sequence: 7, // Application layer in OSI model
        next_layer: 'presentation' // Layer 6
      }
    }

    // Here you would typically send this to the Presentation layer service
    // For now, we'll return it as JSON
    res.status(200).json({
      success: true,
      message: 'Data prepared for Presentation layer',
      data: presentationData,
      instructions: {
        next_step: 'Data is ready to be sent to Presentation layer (Layer 6)',
        presentation_layer_tasks: [
          'Data formatting and encoding',
          'Encryption/Decryption (if HTTPS)',
          'Compression (if enabled)',
          'Character set conversion',
          'Protocol conversion'
        ]
      }
    })

  } catch (error) {
    console.error('Error preparing data for Presentation layer:', error)
    
    if (error instanceof ValidationError || error instanceof FileError) {
      return res.status(error.statusCode).json({
        success: false,
        error: {
          message: error.message,
          code: error.code || 'VALIDATION_ERROR'
        }
      })
    }
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to prepare data for Presentation layer',
        code: 'INTERNAL_ERROR'
      }
    })
  }
})

// Get data ready for Presentation layer (GET method for existing envelopes)
router.get('/send-to-presentation/:envelopeId', (req, res) => {
  try {
    const { envelopeId } = req.params
    const envelopePath = path.resolve('outbox', `${envelopeId}.json`)
    
    if (!fs.existsSync(envelopePath)) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Envelope not found',
          code: 'NOT_FOUND'
        }
      })
    }

    const envelope = JSON.parse(fs.readFileSync(envelopePath, 'utf-8'))
    
    // Transform envelope data for Presentation layer
    const presentationData = {
      layer: 'application',
      timestamp: new Date().toISOString(),
      session: {
        source: {
          host: envelope.headers.sender,
          ip: null, // Would need to be resolved
          port: 3000
        },
        destination: {
          host: envelope.headers.receiver,
          ip: null,
          port: 3000
        }
      },
      protocol: {
        type: 'HTTP',
        version: '1.1'
      },
      data: {
        content_type: envelope.content.file?.mime_type || 'text/plain',
        encoding: 'utf-8',
        format: envelope.preferences.format || 'json',
        size_bytes: envelope.content.file?.size_bytes || (envelope.content.message ? Buffer.from(envelope.content.message).length : 0),
        payload: {
          message: envelope.content.message,
          file: envelope.content.file
        }
      },
      transfer_config: {
        mode: 'binary',
        chunk_size_kb: 32,
        compression: false,
        encryption: false
      },
      meta: {
        schema: 'application_to_presentation.v1',
        layer_sequence: 7,
        next_layer: 'presentation',
        original_envelope: envelopeId
      }
    }

    res.status(200).json({
      success: true,
      message: 'Envelope data prepared for Presentation layer',
      data: presentationData
    })

  } catch (error) {
    console.error('Error reading envelope:', error)
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to prepare envelope for Presentation layer',
        code: 'INTERNAL_ERROR'
      }
    })
  }
})

// Message Queue Endpoints

// Add message to queue
router.post('/queue/add', upload.single('file'), async (req, res) => {
  try {
    const { sender, receiver, senderIP, receiverIP, message, format, protocol, transferMode, chunkSize } = req.body
    
    // Validate required fields
    if (!sender || !receiver) {
      throw new ValidationError('Sender and receiver are required')
    }
    
    if (!message && !req.file) {
      throw new ValidationError('Either message or file is required')
    }

    // Validate file if present
    if (req.file) {
      validateFile(req.file)
    }

    // Prepare message data
    const messageData = {
      sender,
      receiver,
      senderIP,
      receiverIP,
      message,
      format: format || 'json',
      protocol: protocol || 'http',
      transferMode: transferMode || 'binary',
      chunkSize: parseInt(chunkSize) || 32,
      file: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        buffer: req.file.buffer.toString('base64') // Convert buffer to base64 for storage
      } : null
    }

    // Add to queue
    const queueItem = messageQueue.enqueue(messageData)

    res.status(201).json({
      success: true,
      message: 'Message added to queue',
      queueItem: {
        id: queueItem.id,
        status: queueItem.status,
        queuedAt: queueItem.queuedAt,
        position: messageQueue.size()
      },
      queue: {
        size: messageQueue.size(),
        stats: messageQueue.getStats()
      }
    })
  } catch (error) {
    console.error('Error adding to queue:', error)
    
    if (error instanceof ValidationError || error instanceof FileError) {
      return res.status(error.statusCode).json({
        success: false,
        error: {
          message: error.message,
          code: error.code || 'VALIDATION_ERROR'
        }
      })
    }
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Failed to add message to queue',
        code: 'INTERNAL_ERROR'
      }
    })
  }
})

// Get queue status
router.get('/queue/status', (req, res) => {
  try {
    const stats = messageQueue.getStats()
    const allMessages = messageQueue.getAll()

    res.json({
      success: true,
      queue: {
        size: messageQueue.size(),
        isEmpty: messageQueue.isEmpty(),
        processing: messageQueue.processing,
        stats
      },
      messages: allMessages.map(item => ({
        id: item.id,
        status: item.status,
        queuedAt: item.queuedAt,
        attempts: item.attempts,
        maxAttempts: item.maxAttempts,
        sender: item.message.sender,
        receiver: item.message.receiver,
        hasFile: !!item.message.file,
        error: item.error
      }))
    })
  } catch (error) {
    console.error('Error getting queue status:', error)
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get queue status',
        code: 'INTERNAL_ERROR'
      }
    })
  }
})

// Process queue
router.post('/queue/process', async (req, res) => {
  try {
    if (messageQueue.processing) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Queue is already being processed',
          code: 'ALREADY_PROCESSING'
        }
      })
    }

    // Start processing in background
    setImmediate(async () => {
      await messageQueue.processQueue(async (messageData) => {
        // Process each message: save envelope and transfer record
        let fileInfo = null
        
        if (messageData.file) {
          // Restore file from base64
          const fileBuffer = Buffer.from(messageData.file.buffer, 'base64')
          const outDir = path.resolve('outbox', 'uploads')
          fs.mkdirSync(outDir, { recursive: true })
          
          const sanitizedName = messageData.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
          const filePath = path.join(outDir, sanitizedName)
          
          fs.writeFileSync(filePath, fileBuffer)
          fileInfo = {
            path: filePath,
            name: messageData.file.originalname,
            sanitized_name: sanitizedName,
            size_bytes: messageData.file.size,
            mime_type: messageData.file.mimetype
          }
        }

        // Save envelope
        const envelope = {
          headers: { sender: messageData.sender, receiver: messageData.receiver },
          content: { message: messageData.message || null, file: fileInfo },
          preferences: { format: messageData.format },
          meta: { created_at: new Date().toISOString(), schema: 'application.input.v1' }
        }
        
        writeEnvelope(envelope)

        // Save transfer record
        const file = fileInfo ? {
          originalname: fileInfo.name,
          size: fileInfo.size_bytes
        } : null

        saveTransferRecord(
          messageData.sender,
          messageData.receiver,
          messageData.senderIP,
          messageData.receiverIP,
          messageData.message,
          file,
          messageData.protocol,
          messageData.transferMode,
          messageData.chunkSize
        )
      })
    })

    res.json({
      success: true,
      message: 'Queue processing started',
      queue: {
        size: messageQueue.size(),
        stats: messageQueue.getStats()
      }
    })
  } catch (error) {
    console.error('Error processing queue:', error)
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to process queue',
        code: 'INTERNAL_ERROR'
      }
    })
  }
})

// Clear queue
router.post('/queue/clear', (req, res) => {
  try {
    const sizeBefore = messageQueue.size()
    messageQueue.clear()

    res.json({
      success: true,
      message: `Queue cleared. ${sizeBefore} messages removed.`,
      queue: {
        size: 0,
        isEmpty: true
      }
    })
  } catch (error) {
    console.error('Error clearing queue:', error)
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to clear queue',
        code: 'INTERNAL_ERROR'
      }
    })
  }
})

// Remove specific message from queue
router.delete('/queue/:id', (req, res) => {
  try {
    const { id } = req.params
    const removed = messageQueue.removeById(id)

    if (!removed) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Message not found in queue',
          code: 'NOT_FOUND'
        }
      })
    }

    res.json({
      success: true,
      message: 'Message removed from queue',
      removed: {
        id: removed.id,
        status: removed.status
      },
      queue: {
        size: messageQueue.size()
      }
    })
  } catch (error) {
    console.error('Error removing from queue:', error)
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to remove message from queue',
        code: 'INTERNAL_ERROR'
      }
    })
  }
})

export default router
