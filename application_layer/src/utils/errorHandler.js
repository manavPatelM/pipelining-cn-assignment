// Error handling utilities and validators

export class ApplicationError extends Error {
  constructor(message, statusCode = 400, errorCode = 'APPLICATION_ERROR') {
    super(message)
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.name = this.constructor.name
  }
}

export class ValidationError extends ApplicationError {
  constructor(message, field = null) {
    super(message, 400, 'VALIDATION_ERROR')
    this.field = field
  }
}

export class FileError extends ApplicationError {
  constructor(message, errorCode = 'FILE_ERROR') {
    super(message, 400, errorCode)
  }
}

// File validation configuration
export const FILE_VALIDATION = {
  // Maximum file size: 100MB
  MAX_FILE_SIZE: 100 * 1024 * 1024,
  
  // Allowed MIME types with categories
  ALLOWED_TYPES: {
    documents: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      'application/rtf'
    ],
    images: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/bmp'
    ],
    archives: [
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/x-tar',
      'application/gzip'
    ],
    media: [
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
      'video/x-msvideo',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg'
    ],
    code: [
      'application/json',
      'application/xml',
      'text/html',
      'text/css',
      'text/javascript',
      'application/javascript'
    ]
  },

  // Dangerous file extensions to block
  BLOCKED_EXTENSIONS: [
    '.exe', '.bat', '.cmd', '.com', '.scr', '.msi',
    '.vbs', '.js', '.jar', '.app', '.deb', '.rpm'
  ]
}

// Get all allowed MIME types as flat array
export function getAllowedMimeTypes() {
  return Object.values(FILE_VALIDATION.ALLOWED_TYPES).flat()
}

// Validate file type
export function validateFileType(file) {
  if (!file) {
    throw new FileError('No file provided', 'NO_FILE')
  }

  const mimeType = file.mimetype
  const fileName = file.originalname || file.name
  const fileExt = fileName.substring(fileName.lastIndexOf('.')).toLowerCase()

  // Check if extension is blocked
  if (FILE_VALIDATION.BLOCKED_EXTENSIONS.includes(fileExt)) {
    throw new FileError(
      `File type ${fileExt} is not allowed for security reasons`,
      'BLOCKED_FILE_TYPE'
    )
  }

  // Check if MIME type is allowed
  const allowedTypes = getAllowedMimeTypes()
  if (!allowedTypes.includes(mimeType)) {
    throw new FileError(
      `File type ${mimeType} is not allowed. Allowed types: documents, images, archives, media, code files`,
      'INVALID_FILE_TYPE'
    )
  }

  return true
}

// Validate file size
export function validateFileSize(file, maxSize = FILE_VALIDATION.MAX_FILE_SIZE) {
  if (!file) {
    throw new FileError('No file provided', 'NO_FILE')
  }

  const fileSize = file.size
  if (fileSize > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2)
    throw new FileError(
      `File size ${fileSizeMB}MB exceeds maximum allowed size of ${maxSizeMB}MB`,
      'FILE_TOO_LARGE'
    )
  }

  return true
}

// Validate filename
export function validateFileName(fileName) {
  if (!fileName || typeof fileName !== 'string') {
    throw new ValidationError('Invalid filename', 'fileName')
  }

  // Check for path traversal attempts
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    throw new ValidationError('Filename contains invalid characters', 'fileName')
  }

  // Check filename length
  if (fileName.length > 255) {
    throw new ValidationError('Filename is too long (max 255 characters)', 'fileName')
  }

  // Check for null bytes
  if (fileName.includes('\0')) {
    throw new ValidationError('Filename contains null bytes', 'fileName')
  }

  return true
}

// Validate IP address or hostname
export function validateHost(host, fieldName = 'host') {
  if (!host || typeof host !== 'string') {
    throw new ValidationError(`Invalid ${fieldName}`, fieldName)
  }

  // Trim whitespace
  host = host.trim()

  // Check if it's a valid IP address (IPv4)
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/
  if (ipv4Pattern.test(host)) {
    const parts = host.split('.')
    if (parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255)) {
      return true
    }
  }

  // Check if it's a valid hostname
  const hostnamePattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  if (hostnamePattern.test(host)) {
    return true
  }

  throw new ValidationError(`Invalid ${fieldName} format`, fieldName)
}

// Validate protocol
export function validateProtocol(protocol) {
  const validProtocols = ['http', 'ftp', 'https', 'ftps']
  if (!protocol || !validProtocols.includes(protocol.toLowerCase())) {
    throw new ValidationError(
      `Invalid protocol. Allowed: ${validProtocols.join(', ')}`,
      'protocol'
    )
  }
  return true
}

// Validate transfer mode
export function validateTransferMode(mode) {
  const validModes = ['binary', 'ascii']
  if (!mode || !validModes.includes(mode.toLowerCase())) {
    throw new ValidationError(
      `Invalid transfer mode. Allowed: ${validModes.join(', ')}`,
      'mode'
    )
  }
  return true
}

// Comprehensive file validation
export function validateFile(file, options = {}) {
  const errors = []

  try {
    validateFileType(file)
  } catch (err) {
    errors.push({ field: 'file', message: err.message, code: err.errorCode })
  }

  try {
    validateFileSize(file, options.maxSize)
  } catch (err) {
    errors.push({ field: 'file', message: err.message, code: err.errorCode })
  }

  try {
    validateFileName(file.originalname || file.name)
  } catch (err) {
    errors.push({ field: 'fileName', message: err.message, code: err.errorCode })
  }

  if (errors.length > 0) {
    const error = new ValidationError('File validation failed')
    error.errors = errors
    throw error
  }

  return true
}

// Error response formatter
export function formatErrorResponse(error) {
  if (error instanceof ApplicationError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.errorCode,
        field: error.field || null,
        errors: error.errors || null
      }
    }
  }

  // Generic error
  return {
    success: false,
    error: {
      message: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR'
    }
  }
}

// Express error handler middleware
export function errorHandler(err, req, res, next) {
  console.error('Error:', err)

  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json(formatErrorResponse(err))
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'File size exceeds limit',
        code: 'FILE_TOO_LARGE'
      }
    })
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Unexpected file field',
        code: 'INVALID_FILE_FIELD'
      }
    })
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }
  })
}
