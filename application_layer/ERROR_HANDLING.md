# Error Handling Documentation

## Overview
This application implements comprehensive error handling for file transfers and message submissions.

## Error Types

### 1. ValidationError
- **Status Code**: 400
- **Error Code**: `VALIDATION_ERROR`
- **Description**: Input validation failures

**Common Cases**:
- Missing required fields
- Invalid format for fields
- Invalid protocol/mode values

### 2. FileError
- **Status Code**: 400
- **Error Code**: Varies by type
- **Description**: File-related errors

**Error Codes**:
- `NO_FILE`: No file provided
- `INVALID_FILE_TYPE`: File type not allowed
- `FILE_TOO_LARGE`: File exceeds size limit (100MB)
- `BLOCKED_FILE_TYPE`: Dangerous file extension

### 3. ApplicationError
- **Status Code**: 400-500
- **Error Code**: `APPLICATION_ERROR`
- **Description**: General application errors

## File Validation Rules

### Maximum File Size
- **Limit**: 100 MB (104,857,600 bytes)
- **Error**: `FILE_TOO_LARGE`

### Allowed File Types

#### Documents
- PDF (application/pdf)
- Word (.doc, .docx)
- Excel (.xls, .xlsx)
- PowerPoint (.ppt, .pptx)
- Text files (.txt, .csv, .rtf)

#### Images
- JPEG/JPG (image/jpeg)
- PNG (image/png)
- GIF (image/gif)
- WebP (image/webp)
- SVG (image/svg+xml)
- BMP (image/bmp)

#### Archives
- ZIP (application/zip)
- RAR (application/x-rar-compressed)
- 7Z (application/x-7z-compressed)
- TAR (application/x-tar)
- GZIP (application/gzip)

#### Media
- MP4 (video/mp4)
- MPEG (video/mpeg)
- QuickTime (video/quicktime)
- AVI (video/x-msvideo)
- MP3 (audio/mpeg)
- WAV (audio/wav)
- OGG (audio/ogg)

#### Code Files
- JSON (application/json)
- XML (application/xml)
- HTML (text/html)
- CSS (text/css)
- JavaScript (text/javascript, application/javascript)

### Blocked File Extensions
For security reasons, the following extensions are blocked:
- .exe (Executables)
- .bat (Batch files)
- .cmd (Command files)
- .com (DOS executables)
- .scr (Screen savers)
- .msi (Windows installers)
- .vbs (VBScript files)
- .js (JavaScript - when uploaded as executable)
- .jar (Java archives)
- .app (macOS applications)
- .deb (Debian packages)
- .rpm (RPM packages)

### Filename Validation
- **Max Length**: 255 characters
- **Invalid Characters**: 
  - Path traversal: `..`, `/`, `\`
  - Null bytes: `\0`
- **Sanitization**: Special characters replaced with `_`

## Host/IP Validation

### Valid Formats
- IPv4 addresses: `192.168.1.1`
- Hostnames: `example.com`, `server.local`

### Invalid Formats
- Invalid IP ranges (parts > 255)
- Invalid hostname characters
- Empty or whitespace-only values

## Protocol Validation

### Supported Protocols
- `http` - HTTP transfer
- `ftp` - FTP transfer
- `https` - HTTPS transfer (future)
- `ftps` - FTPS transfer (future)

### Transfer Modes
- `binary` - Binary mode (default)
- `ascii` - ASCII mode

## API Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "field": "fieldName",
    "errors": [
      {
        "field": "file",
        "message": "Specific error",
        "code": "ERROR_CODE"
      }
    ]
  }
}
```

### Example Errors

#### Invalid File Type
```json
{
  "success": false,
  "error": {
    "message": "File type application/exe is not allowed",
    "code": "INVALID_FILE_TYPE",
    "field": null
  }
}
```

#### File Too Large
```json
{
  "success": false,
  "error": {
    "message": "File size 150.00MB exceeds maximum allowed size of 100.00MB",
    "code": "FILE_TOO_LARGE",
    "field": null
  }
}
```

#### Missing Required Fields
```json
{
  "success": false,
  "error": {
    "message": "Missing required fields: protocol, source, destination, fileName",
    "code": "VALIDATION_ERROR",
    "field": null
  }
}
```

#### Invalid Host
```json
{
  "success": false,
  "error": {
    "message": "Invalid source format",
    "code": "VALIDATION_ERROR",
    "field": "source"
  }
}
```

## Frontend Error Handling

### File Upload Validation
The frontend validates files before upload:
1. File size check (100MB limit)
2. Extension check (blocks dangerous types)
3. MIME type verification

### Error Display
Errors are displayed in multiple ways:
1. **Error Modal**: Pop-up with detailed error message
2. **Console Logs**: Timestamped error logs in transfer log
3. **Status Updates**: Real-time status updates

### User Feedback
- Clear error messages
- Specific field validation
- Helpful suggestions for resolution

## Testing Error Scenarios

### Test Invalid File Type
```bash
# Upload an .exe file - should be blocked
```

### Test File Size Limit
```bash
# Upload a file > 100MB - should be rejected
```

### Test Missing Fields
```bash
# Submit without required fields - should show validation error
```

### Test Invalid IP
```bash
# Use invalid IP like "999.999.999.999" - should be rejected
```

### Test Invalid Protocol
```bash
# Use unsupported protocol - should be rejected
```

## Error Recovery

### Automatic Recovery
- Failed transfers can be retried
- Validation errors provide clear guidance
- Form data is preserved on validation errors

### Manual Recovery
- User can correct errors and resubmit
- File can be changed if validation fails
- All validation messages are actionable

## Best Practices

1. **Always validate on both client and server**
2. **Provide specific error messages**
3. **Log errors for debugging**
4. **Sanitize user input**
5. **Use appropriate HTTP status codes**
6. **Handle edge cases gracefully**

## Security Considerations

- File type validation prevents malicious uploads
- Filename sanitization prevents path traversal
- Size limits prevent DoS attacks
- Extension blocking prevents executable uploads
- MIME type validation adds extra security layer
