# Error Handling Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│  (transfer.html, index.html, test-errors.html)                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Validation                          │
│  ─────────────────────────────────────────────────────────      │
│  • File type check                                              │
│  • File size check (100MB)                                      │
│  • Extension validation                                         │
│  • Input field validation                                       │
│  • MIME type verification                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                   ✗│                  ✓│
                    ▼                   ▼
         ┌────────────────┐   ┌────────────────┐
         │  Show Error    │   │  Send Request  │
         │     Modal      │   │   to Backend   │
         └────────────────┘   └────────────────┘
                                       │
                                       ▼
         ┌─────────────────────────────────────────────────────────┐
         │                Express Middleware Layer                 │
         │  ────────────────────────────────────────────────────   │
         │  • Body parsing (express.json, urlencoded)              │
         │  • Multer file upload (100MB limit)                     │
         │  • Static file serving                                  │
         └─────────────────────────────────────────────────────────┘
                                       │
                                       ▼
         ┌─────────────────────────────────────────────────────────┐
         │                   Route Handler                         │
         │                   (src/routes.js)                       │
         │  ────────────────────────────────────────────────────   │
         │  • Import validation utilities                          │
         │  • Wrap in try-catch blocks                             │
         │  • Call controller functions                            │
         └─────────────────────────────────────────────────────────┘
                                       │
                                       ▼
         ┌─────────────────────────────────────────────────────────┐
         │              Controller Layer                           │
         │        (src/controllers/transferController.js)         │
         │  ────────────────────────────────────────────────────   │
         │  • Validate required fields                             │
         │  • Validate protocol (http/ftp/https/ftps)             │
         │  • Validate hosts (IP/hostname)                         │
         │  • Validate transfer mode (binary/ascii)                │
         │  • Validate file (if present)                           │
         │  • Validate file size                                   │
         │  • Validate duration                                    │
         └─────────────────────────────────────────────────────────┘
                                       │
                                       ▼
         ┌─────────────────────────────────────────────────────────┐
         │            Validation Utilities Layer                   │
         │             (src/utils/errorHandler.js)                │
         │  ────────────────────────────────────────────────────   │
         │  • validateFile(file, options)                          │
         │  • validateFileType(file)                               │
         │  • validateFileSize(file, maxSize)                      │
         │  • validateFileName(fileName)                           │
         │  • validateHost(host, fieldName)                        │
         │  • validateProtocol(protocol)                           │
         │  • validateTransferMode(mode)                           │
         └─────────────────────────────────────────────────────────┘
                                       │
                          ┌────────────┴────────────┐
                         ✗│                        ✓│
                          ▼                         ▼
         ┌─────────────────────────┐   ┌─────────────────────────┐
         │    Throw Error          │   │   Process Request       │
         │  • ValidationError      │   │  • Save file            │
         │  • FileError            │   │  • Create record        │
         │  • ApplicationError     │   │  • Write to disk        │
         └─────────────────────────┘   └─────────────────────────┘
                          │                         │
                          ▼                         ▼
         ┌─────────────────────────┐   ┌─────────────────────────┐
         │  Error Handler          │   │   Success Response      │
         │  Middleware             │   │  • status: 201          │
         │  (server.js)            │   │  • success: true        │
         │  ────────────────────    │   │  • data                 │
         │  • Catch all errors     │   └─────────────────────────┘
         │  • Format response      │                │
         │  • Set status code      │                │
         │  • Log error            │                │
         └─────────────────────────┘                │
                          │                         │
                          ▼                         ▼
         ┌─────────────────────────────────────────────────────────┐
         │                    Error Response                       │
         │  {                                                      │
         │    "success": false,                                    │
         │    "error": {                                           │
         │      "message": "...",                                  │
         │      "code": "ERROR_CODE",                              │
         │      "field": "fieldName"                               │
         │    }                                                    │
         │  }                                                      │
         └─────────────────────────────────────────────────────────┘
                                       │
                                       ▼
         ┌─────────────────────────────────────────────────────────┐
         │                Frontend Error Handling                  │
         │  ────────────────────────────────────────────────────   │
         │  • Parse error response                                 │
         │  • Display error modal                                  │
         │  • Add to transfer log                                  │
         │  • Update UI status                                     │
         └─────────────────────────────────────────────────────────┘
```

## Error Class Hierarchy

```
Error (Built-in)
    │
    └── ApplicationError
            │
            ├── ValidationError
            │     ├── Missing required fields
            │     ├── Invalid format
            │     ├── Invalid protocol
            │     ├── Invalid mode
            │     └── Invalid host
            │
            └── FileError
                  ├── NO_FILE
                  ├── INVALID_FILE_TYPE
                  ├── FILE_TOO_LARGE
                  └── BLOCKED_FILE_TYPE
```

## Validation Flow

```
┌─────────────────┐
│   File Upload   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  validateFile(file, options)    │
└────────┬────────────────────────┘
         │
         ├─► validateFileType(file)
         │   ├─ Check MIME type
         │   ├─ Check extension
         │   └─ Check blocked list
         │
         ├─► validateFileSize(file, maxSize)
         │   ├─ Compare to 100MB limit
         │   └─ Format error message
         │
         └─► validateFileName(fileName)
             ├─ Check length (max 255)
             ├─ Check for path traversal
             ├─ Check for null bytes
             └─ Sanitize if valid
```

## Data Flow

```
┌────────┐    ┌──────────┐    ┌────────────┐    ┌──────────┐
│ Client │───▶│ Frontend │───▶│  Backend   │───▶│   File   │
│  Form  │    │Validation│    │ Validation │    │  System  │
└────────┘    └──────────┘    └────────────┘    └──────────┘
                   │                 │                 │
                   ▼                 ▼                 ▼
              ┌────────┐        ┌────────┐      ┌──────────┐
              │ Error  │        │ Error  │      │  Success │
              │ Modal  │        │Response│      │ Response │
              └────────┘        └────────┘      └──────────┘
```

## Component Responsibilities

```
┌────────────────────────────────────────────────────────────────┐
│ Frontend (transfer.js, main.js)                                │
│ ─────────────────────────────────────────────────────────────  │
│ • Pre-validate user input                                      │
│ • Display errors to user                                       │
│ • Prevent invalid requests                                     │
│ • Provide immediate feedback                                   │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ Middleware (server.js, multer)                                 │
│ ─────────────────────────────────────────────────────────────  │
│ • Parse request body                                            │
│ • Handle file uploads                                           │
│ • Enforce size limits                                           │
│ • Catch unhandled errors                                        │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ Routes (routes.js)                                              │
│ ─────────────────────────────────────────────────────────────  │
│ • Define endpoints                                              │
│ • Call controllers                                              │
│ • Handle errors with try-catch                                  │
│ • Return responses                                              │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ Controllers (transferController.js)                             │
│ ─────────────────────────────────────────────────────────────  │
│ • Business logic                                                │
│ • Call validation functions                                     │
│ • Process valid requests                                        │
│ • Format responses                                              │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ Utilities (errorHandler.js)                                     │
│ ─────────────────────────────────────────────────────────────  │
│ • Define error classes                                          │
│ • Validation functions                                          │
│ • Error formatting                                              │
│ • Configuration constants                                       │
└────────────────────────────────────────────────────────────────┘
```

## Security Layers

```
Layer 1: Frontend Validation (User Experience)
    ├─ File type check
    ├─ File size check
    └─ Extension validation

Layer 2: Multer Middleware (Upload Protection)
    ├─ File size limit enforcement
    ├─ Memory storage limits
    └─ Field name validation

Layer 3: Backend Validation (Security)
    ├─ MIME type verification
    ├─ Extension blocking
    ├─ Filename sanitization
    ├─ Path traversal prevention
    └─ Input sanitization

Layer 4: File System (Physical Protection)
    ├─ Directory permissions
    ├─ Disk space limits
    └─ File system constraints
```

## Error Handling Strategy

```
┌──────────────────────────────────────┐
│  Try to perform operation            │
└──────────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
   ✓│                        ✗│
    ▼                         ▼
┌────────────┐    ┌────────────────────┐
│  Success   │    │   Catch Error      │
│  Return    │    │  ───────────────   │
│   201      │    │  • Identify type   │
└────────────┘    │  • Format response │
                  │  • Set status code │
                  │  • Log error       │
                  │  • Return to client│
                  └────────────────────┘
```
