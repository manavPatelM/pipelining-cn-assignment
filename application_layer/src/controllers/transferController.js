import fs from 'node:fs'
import path from 'node:path'
import {
  validateFile,
  validateHost,
  validateProtocol,
  validateTransferMode,
  ValidationError,
  FileError,
  formatErrorResponse
} from '../utils/errorHandler.js'

const TRANSFER_LOG_DIR = path.resolve('outbox', 'transfers')

export function ensureTransferLogDir() {
  if (!fs.existsSync(TRANSFER_LOG_DIR)) {
    fs.mkdirSync(TRANSFER_LOG_DIR, { recursive: true })
  }
  return TRANSFER_LOG_DIR
}

export async function saveTransferLog(req, res) {
  try {
    const { protocol, source, sourceIP, destination, destinationIP, mode, duration, fileSize, fileName } = req.body
    
    // Validate required fields
    if (!protocol || !source || !destination || !fileName) {
      throw new ValidationError('Missing required fields: protocol, source, destination, fileName')
    }

    // Validate protocol
    validateProtocol(protocol)

    // Validate hosts
    validateHost(source, 'source')
    validateHost(destination, 'destination')

    // Validate transfer mode
    if (mode) {
      validateTransferMode(mode)
    }

    // Validate file if present
    if (req.file) {
      validateFile(req.file)
    } else if (!fileSize || !fileName) {
      throw new ValidationError('File information is required')
    }

    // Validate file size
    if (fileSize) {
      const size = parseInt(fileSize)
      if (isNaN(size) || size <= 0) {
        throw new ValidationError('Invalid file size', 'fileSize')
      }
      if (size > 100 * 1024 * 1024) { // 100MB limit
        throw new FileError('File size exceeds 100MB limit', 'FILE_TOO_LARGE')
      }
    }

    // Validate duration
    if (duration) {
      const dur = parseInt(duration)
      if (isNaN(dur) || dur < 0) {
        throw new ValidationError('Invalid duration', 'duration')
      }
    }

    ensureTransferLogDir()

    // Save uploaded file if present
    let savedFilePath = null
    if (req.file) {
      const uploadsDir = path.resolve('outbox', 'uploads')
      fs.mkdirSync(uploadsDir, { recursive: true })
      
      // Sanitize filename
      const sanitizedName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
      savedFilePath = path.join(uploadsDir, sanitizedName)
      
      fs.writeFileSync(savedFilePath, req.file.buffer)
    }

    // Create transfer record
    const transferRecord = {
      protocol: protocol.toUpperCase(),
      timestamp: new Date().toISOString(),
      source: {
        host: source,
        ip: sourceIP || source,
        port: protocol === 'http' ? 80 : 21
      },
      destination: {
        host: destination,
        ip: destinationIP || destination,
        port: protocol === 'http' ? 80 : 21
      },
      file: {
        name: fileName,
        size: parseInt(fileSize),
        path: savedFilePath ? path.relative(process.cwd(), savedFilePath) : null,
        mode: mode
      },
      transfer: {
        duration_seconds: parseInt(duration),
        average_speed_kbps: parseInt(fileSize) / 1024 / parseInt(duration),
        status: 'completed',
        chunks_sent: Math.ceil(parseInt(fileSize) / (64 * 1024))
      },
      protocol_details: protocol === 'http' ? {
        method: 'POST',
        endpoint: '/upload',
        content_type: 'application/octet-stream',
        response_code: 200
      } : {
        mode: mode === 'binary' ? 'TYPE I' : 'TYPE A',
        transfer_mode: 'PASV',
        connection: 'binary',
        ftp_code: 226
      },
      meta: {
        created_at: new Date().toISOString(),
        schema: 'file_transfer.v1'
      }
    }

    // Save transfer log
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const logFileName = `${timestamp}-${protocol}-transfer.json`
    const logFilePath = path.join(TRANSFER_LOG_DIR, logFileName)
    
    fs.writeFileSync(logFilePath, JSON.stringify(transferRecord, null, 2), 'utf-8')

    res.status(201).json({
      success: true,
      message: 'Transfer record saved',
      recordPath: path.relative(process.cwd(), logFilePath),
      record: transferRecord
    })
  } catch (error) {
    console.error('Error saving transfer log:', error)
    
    if (error instanceof ValidationError || error instanceof FileError) {
      return res.status(error.statusCode).json(formatErrorResponse(error))
    }
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to save transfer record',
        code: 'INTERNAL_ERROR'
      }
    })
  }
}

export async function listTransfers(req, res) {
  try {
    ensureTransferLogDir()
    
    const files = fs.readdirSync(TRANSFER_LOG_DIR)
    const transfers = []
    
    for (const f of files) {
      if (!f.endsWith('.json')) continue
      
      try {
        const content = fs.readFileSync(path.join(TRANSFER_LOG_DIR, f), 'utf-8')
        const data = JSON.parse(content)
        transfers.push({
          fileName: f,
          ...data
        })
      } catch (parseError) {
        console.error(`Error parsing ${f}:`, parseError)
        // Skip corrupted files
        continue
      }
    }
    
    transfers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    res.json({
      success: true,
      total: transfers.length,
      transfers
    })
  } catch (error) {
    console.error('Error listing transfers:', error)
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to list transfers',
        code: 'INTERNAL_ERROR'
      }
    })
  }
}
