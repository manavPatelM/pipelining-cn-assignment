# Error Handling Quick Reference

## 🔴 Error Codes

| Code | Description | Status | Fix |
|------|-------------|--------|-----|
| `VALIDATION_ERROR` | Input validation failed | 400 | Check required fields and format |
| `INVALID_FILE_TYPE` | File type not allowed | 400 | Use allowed file types (see below) |
| `FILE_TOO_LARGE` | File exceeds 100MB | 400 | Reduce file size or split file |
| `BLOCKED_FILE_TYPE` | Dangerous file extension | 400 | Change file extension to allowed type |
| `NO_FILE` | Missing file | 400 | Provide a file |
| `INTERNAL_ERROR` | Server error | 500 | Check server logs |

## ✅ Allowed File Types

### Documents
- `.pdf` `.doc` `.docx` `.xls` `.xlsx` `.ppt` `.pptx` `.txt` `.csv` `.rtf`

### Images
- `.jpg` `.jpeg` `.png` `.gif` `.webp` `.svg` `.bmp`

### Archives
- `.zip` `.rar` `.7z` `.tar` `.gz`

### Media
- `.mp4` `.mpeg` `.mov` `.avi` `.mp3` `.wav` `.ogg`

### Code
- `.json` `.xml` `.html` `.css` `.js`

## ❌ Blocked Extensions
- `.exe` `.bat` `.cmd` `.com` `.scr` `.msi` `.vbs` `.jar` `.app` `.deb` `.rpm`

## 📏 Limits

- **Max File Size**: 100 MB
- **Max Filename Length**: 255 characters
- **Supported Protocols**: http, ftp, https, ftps
- **Transfer Modes**: binary, ascii

## 🧪 Quick Test

```bash
# Test the error handling
curl -X POST http://localhost:3000/api/v1/application/transfer/save \
  -F "protocol=http" \
  -F "source=192.168.1.10" \
  -F "destination=192.168.1.20" \
  -F "mode=binary" \
  -F "duration=10" \
  -F "fileSize=1000" \
  -F "fileName=test.txt"
```

## 🔍 Debugging

### Check Error Details
```javascript
// Frontend
fetch('/api/v1/application/transfer/save', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => {
  if (!data.success) {
    console.error('Error:', data.error.message)
    console.error('Code:', data.error.code)
    console.error('Field:', data.error.field)
  }
})
```

### Backend Validation
```javascript
import { validateFile, validateHost, validateProtocol } from './utils/errorHandler.js'

try {
  validateFile(file)
  validateHost(ipAddress, 'source')
  validateProtocol(protocol)
} catch (error) {
  console.error(error.message, error.errorCode)
}
```

## 📱 UI Elements

### Show Error Modal
```javascript
showError('Error Title', 'Error message')
showError('Error Title', ['Error 1', 'Error 2'])
```

### Add Log Entry
```javascript
addLog('Message', 'info')   // Blue
addLog('Success', 'success') // Green
addLog('Error', 'error')     // Red
```

## 🎯 Common Issues

### "File type not allowed"
- Check if MIME type is in allowed list
- Verify file extension is not blocked
- Use supported file types

### "File size exceeds limit"
- Maximum is 100MB
- Compress file before upload
- Split large files

### "Invalid IP format"
- Use valid IPv4: `192.168.1.1`
- Use valid hostname: `server.example.com`
- No spaces or special characters

### "Missing required fields"
- Ensure all required fields are provided:
  - protocol, source, destination, fileName

## 🛠️ Development

### Add New Validation
```javascript
// src/utils/errorHandler.js
export function validateNewField(value) {
  if (!isValid(value)) {
    throw new ValidationError('Error message', 'fieldName')
  }
  return true
}
```

### Add New Error Type
```javascript
export class CustomError extends ApplicationError {
  constructor(message) {
    super(message, 400, 'CUSTOM_ERROR')
  }
}
```

### Use in Controller
```javascript
import { validateNewField, CustomError } from '../utils/errorHandler.js'

try {
  validateNewField(req.body.field)
} catch (error) {
  return res.status(error.statusCode).json(formatErrorResponse(error))
}
```

## 📚 Resources

- Full documentation: `ERROR_HANDLING.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`
- Test suite: `http://localhost:3000/test-errors`
- API reference: See routes in `src/routes.js`
