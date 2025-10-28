# Application Layer - UI Only (Student 1)

This project provides a minimal browser UI to enter a message or upload a file, plus a file transfer simulator with HTTP/FTP protocol support and comprehensive error handling. **NEW: Message composer now includes automatic transfer simulation and validation!**

## Features

### 1. Message Composer (/) **✨ NEW: Integrated Simulation**
- Simple webpage with text input, drag-and-drop/file picker, and format selector
- **🎯 Automatic validation** - Real-time error checking on submit
- **📡 Transfer simulation** - Visualize HTTP transfer with progress bar
- **📋 Validation results** - Color-coded error/warning/success messages
- **📊 Transfer log** - Timestamped log of validation and transfer events
- Backend endpoint: `POST /api/v1/application/ui/submit` (multipart)
- Output: JSON files in `outbox/*.json` referencing any uploaded file path under `outbox/uploads/`

**When you submit data:**
1. ✅ **Validates** sender, receiver, message/file, file type, file size
2. 📡 **Simulates** HTTP transfer with progress tracking
3. 💾 **Saves** validated data to outbox
4. 📝 **Logs** entire process with timestamps

### 2. File Transfer Simulator (/transfer)
- Simulate file transfers using HTTP or FTP protocols
- Real-time progress tracking with logs
- Protocol-specific handshake simulations
- Transfer statistics (speed, duration, progress)
- Save transfer records to `outbox/transfers/`

### 3. Error Handling System
- Comprehensive validation for file types, sizes, and formats
- Invalid file type detection (blocks executables)
- File size limits (100MB maximum)
- IP address and hostname validation
- Protocol and transfer mode validation
- User-friendly error messages

### 4. Transfer History (/outbox)
- View all completed file transfers
- Detailed transfer information
- Protocol-specific metadata

### 5. Error Testing Suite (/test-errors)
- Interactive test page for validation
- Test invalid file types, sizes, and formats
- Verify error handling behavior

## Run
```bash
npm install
npm start
# open http://127.0.0.1:3000/
```

## Available Pages
- `/` - Message Composer **✨ with Integrated Simulation & Validation**
- `/transfer` - File Transfer Simulator
- `/outbox` - Transfer History
- `/test-errors` - Error Handling Tests

## Quick Start

### Test the Integrated Workflow
1. Visit `http://127.0.0.1:3000/`
2. Fill in sender (e.g., "student1@app") and receiver (e.g., "server@app")
3. Enter a message or upload a file
4. Click "Save to Outbox"
5. **Watch the magic happen:**
   - ✅ Instant validation with color-coded results
   - 📊 Real-time transfer simulation with progress bar
   - 📝 Detailed transfer log with timestamps
   - 💾 Data saved to outbox on success

### Test Error Scenarios
1. Leave sender empty → See validation error
2. Upload .exe file → See security block
3. Upload 150MB file → See size limit error
4. Submit with warnings → See proceed with caution

For detailed testing, visit `/test-errors`

## Error Handling

See [ERROR_HANDLING.md](ERROR_HANDLING.md) for complete documentation.

### Validation Rules
- **Max file size**: 100MB
- **Allowed file types**: Documents, images, archives, media, code files
- **Blocked extensions**: .exe, .bat, .cmd, .com, .scr, .msi, .vbs, .jar, etc.
- **IP validation**: Valid IPv4 or hostname format
- **Protocol validation**: http, ftp, https, ftps

### Error Codes
- `VALIDATION_ERROR` - Input validation failure
- `INVALID_FILE_TYPE` - Unsupported file type
- `FILE_TOO_LARGE` - File exceeds size limit
- `BLOCKED_FILE_TYPE` - Dangerous file extension
- `NO_FILE` - Missing file

## Envelope schema
```json
{
  "headers": { "sender": "string", "receiver": "string" },
  "content": {
    "message": "string|null",
    "file": { 
      "path": "string", 
      "name": "string", 
      "size_bytes": number,
      "mime_type": "string",
      "sanitized_name": "string"
    } | null
  },
  "preferences": { "format": "json|xml" },
  "meta": { "created_at": "ISO-8601", "schema": "application.input.v1" }
}
```

## Transfer Record Schema
```json
{
  "protocol": "HTTP|FTP",
  "timestamp": "ISO-8601",
  "source": { "host": "string", "port": number },
  "destination": { "host": "string", "port": number },
  "file": {
    "name": "string",
    "size": number,
    "path": "string|null",
    "mode": "binary|ascii"
  },
  "transfer": {
    "duration_seconds": number,
    "average_speed_kbps": number,
    "status": "completed",
    "chunks_sent": number
  },
  "protocol_details": { },
  "meta": { "created_at": "ISO-8601", "schema": "file_transfer.v1" }
}
```

## Notes for teammates
- Watch `outbox/` for new JSONs and process accordingly.
- If `content.file` exists, read bytes from `content.file.path`.
- Transfer logs are stored in `outbox/transfers/`
- All file uploads are validated and sanitized
- **Message composer now includes automatic validation and transfer simulation** - see INTEGRATED_SIMULATION.md for details
