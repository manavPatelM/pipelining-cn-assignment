// Validate file before transfer
function validateFileBeforeTransfer(file) {
  const errors = []
  
  // Check file size (100MB max)
  const maxSize = 100 * 1024 * 1024
  if (file.size > maxSize) {
    errors.push(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum of 100MB`)
  }

  // Check for dangerous extensions
  const dangerousExts = ['.exe', '.bat', '.cmd', '.com', '.scr', '.msi', '.vbs', '.jar']
  const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
  if (dangerousExts.includes(fileExt)) {
    errors.push(`File type ${fileExt} is not allowed for security reasons`)
  }

  // Check file type
  const allowedTypes = [
    // Documents
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv',
    // Images
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    // Archives
    'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
    'application/gzip', 'application/x-tar',
    // Media
    'video/mp4', 'video/mpeg', 'audio/mpeg', 'audio/wav',
    // Code
    'application/json', 'application/xml', 'text/html', 'text/css',
    'application/javascript', 'text/javascript',
    // Binary
    'application/octet-stream'
  ]

  if (!allowedTypes.includes(file.type) && file.type !== '') {
    errors.push(`File type ${file.type} may not be supported. Proceed with caution.`)
  }

  return errors
}

// Domain name to IP mapping (DNS simulation)
const domainToIP = {}

function generateIP(domain) {
  // Generate consistent IP based on domain hash
  let hash = 0
  for (let i = 0; i < domain.length; i++) {
    hash = ((hash << 5) - hash) + domain.charCodeAt(i)
    hash = hash & hash
  }
  
  // Convert to IP format
  const octet1 = 192
  const octet2 = 168
  const octet3 = Math.abs(hash % 256)
  const octet4 = Math.abs((hash >> 8) % 256)
  
  return `${octet1}.${octet2}.${octet3}.${octet4}`
}

function resolveDomainToIP(domain) {
  if (!domain || domain.trim().length === 0) return null
  
  const trimmedDomain = domain.trim().toLowerCase()
  
  // Check if it's already an IP address
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/
  if (ipPattern.test(trimmedDomain)) {
    return trimmedDomain
  }
  
  // Check cache
  if (domainToIP[trimmedDomain]) {
    return domainToIP[trimmedDomain]
  }
  
  // Generate new IP for domain
  const ip = generateIP(trimmedDomain)
  domainToIP[trimmedDomain] = ip
  
  return ip
}


// Show error modal
function showError(title, messages) {
  const errorList = Array.isArray(messages) ? messages : [messages]
  const errorHTML = errorList.map(msg => `<div style="padding: 8px 0; border-bottom: 1px solid var(--border);">⚠️ ${msg}</div>`).join('')
  
  addLog(`Error: ${errorList.join('; ')}`, 'error')
  
  const modal = document.createElement('div')
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.8); z-index: 9999;
    display: flex; align-items: center; justify-content: center;
  `
  
  modal.innerHTML = `
    <div style="background: var(--card); border: 1px solid #ef4444; border-radius: 12px; 
                padding: 24px; max-width: 500px; width: 90%;">
      <h2 style="margin: 0 0 16px; color: #ef4444;">❌ ${title}</h2>
      <div style="margin-bottom: 20px;">${errorHTML}</div>
      <button onclick="this.closest('div').parentElement.remove()" 
              style="width: 100%; padding: 10px; background: #ef4444; border: none; 
                     border-radius: 8px; color: white; cursor: pointer; font-size: 14px;">
        Close
      </button>
    </div>
  `
  
  document.body.appendChild(modal)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove()
  })
}

const drop = document.getElementById('dropzone')
const fileInput = document.getElementById('file')
const form = document.getElementById('transfer-form')
const fileInfo = document.getElementById('fileInfo')
const pick = document.getElementById('pick')
const httpOption = document.getElementById('http-option')
const ftpOption = document.getElementById('ftp-option')
const protocolHttpRadio = document.getElementById('protocol-http')
const protocolFtpRadio = document.getElementById('protocol-ftp')
const transferStatus = document.getElementById('transferStatus')
const progressFill = document.getElementById('progressFill')
const transferBtn = document.getElementById('transferBtn')
const stopBtn = document.getElementById('stopBtn')
const logContainer = document.getElementById('transferLog')

let isTransferring = false
let stopRequested = false

// Protocol selection handling
httpOption.addEventListener('click', () => {
  protocolHttpRadio.checked = true
  httpOption.classList.add('selected')
  ftpOption.classList.remove('selected')
})

ftpOption.addEventListener('click', () => {
  protocolFtpRadio.checked = true
  ftpOption.classList.add('selected')
  httpOption.classList.remove('selected')
})

// Drag and drop handling
function setDrag(active) { 
  drop.classList.toggle('drag', !!active) 
}

;['dragenter', 'dragover'].forEach(ev => {
  drop.addEventListener(ev, e => { 
    e.preventDefault()
    e.stopPropagation()
    setDrag(true) 
  })
})

;['dragleave', 'drop'].forEach(ev => {
  drop.addEventListener(ev, e => { 
    e.preventDefault()
    e.stopPropagation()
    setDrag(false) 
  })
})

drop.addEventListener('click', () => fileInput.click())
pick && pick.addEventListener('click', () => fileInput.click())

drop.addEventListener('drop', e => {
  const dt = e.dataTransfer
  if (dt && dt.files && dt.files.length > 0) {
    fileInput.files = dt.files
    updateFileInfo(dt.files[0])
  }
})

fileInput.addEventListener('change', () => {
  const f = fileInput.files && fileInput.files[0]
  if (f) updateFileInfo(f)
  else fileInfo.textContent = 'No file selected'
})

function updateFileInfo(file) {
  const sizeKB = (file.size / 1024).toFixed(1)
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
  const displaySize = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`
  fileInfo.textContent = `${file.name} • ${displaySize}`
}

// Logging functions
function addLog(message, type = 'info') {
  const entry = document.createElement('div')
  entry.className = `log-entry log-${type}`
  const time = new Date().toLocaleTimeString()
  entry.innerHTML = `<span class="log-time">[${time}]</span> ${message}`
  logContainer.appendChild(entry)
  logContainer.scrollTop = logContainer.scrollHeight
}

function clearLog() {
  logContainer.innerHTML = ''
}

// Update stats
function updateStats(transferred, total, speed, elapsed, status) {
  document.getElementById('transferred').textContent = 
    transferred > 1024 ? `${(transferred / 1024).toFixed(2)} MB` : `${transferred.toFixed(1)} KB`
  document.getElementById('speed').textContent = `${speed.toFixed(1)} KB/s`
  document.getElementById('elapsed').textContent = `${elapsed}s`
  document.getElementById('status').textContent = status
}

// Simulate transfer
async function simulateTransfer(protocol, file, source, destination, mode, chunkSize) {
  const totalSize = file.size
  const totalChunks = Math.ceil(totalSize / (chunkSize * 1024))
  let transferred = 0
  const startTime = Date.now()

  clearLog()
  transferStatus.style.display = 'block'
  isTransferring = true
  stopRequested = false
  transferBtn.style.display = 'none'
  stopBtn.style.display = 'block'

  // Initial logs based on protocol
  if (protocol === 'http') {
    addLog(`Initiating HTTP transfer...`, 'info')
    addLog(`Establishing connection to ${destination}:80`, 'info')
    addLog(`HTTP/1.1 POST /upload`, 'info')
    addLog(`Content-Type: application/octet-stream`, 'info')
    addLog(`Content-Length: ${totalSize} bytes`, 'info')
    addLog(`Connection established. Starting data transfer...`, 'success')
  } else {
    addLog(`Initiating FTP transfer...`, 'info')
    addLog(`Connecting to ${destination}:21 (Control Channel)`, 'info')
    addLog(`220 FTP Server Ready`, 'success')
    addLog(`USER anonymous`, 'info')
    addLog(`331 Password required`, 'info')
    addLog(`PASS ******`, 'info')
    addLog(`230 Login successful`, 'success')
    addLog(`TYPE I (Binary Mode)`, 'info')
    addLog(`200 Switching to Binary mode`, 'success')
    addLog(`PASV (Entering Passive Mode)`, 'info')
    addLog(`227 Entering Passive Mode (${destination.replace(/\./g, ',')},200,80)`, 'success')
    addLog(`Opening data connection on port 51280...`, 'info')
    addLog(`STOR ${file.name}`, 'info')
    addLog(`150 Opening BINARY data connection`, 'success')
  }

  // Simulate chunk transfer
  for (let i = 0; i < totalChunks; i++) {
    if (stopRequested) {
      addLog(`Transfer cancelled by user`, 'error')
      updateStats(transferred, totalSize, 0, 0, 'Cancelled')
      break
    }

    const chunkSizeBytes = Math.min(chunkSize * 1024, totalSize - transferred)
    transferred += chunkSizeBytes

    const progress = (transferred / totalSize) * 100
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    const speed = elapsed > 0 ? (transferred / 1024) / elapsed : 0

    progressFill.style.width = `${progress}%`
    progressFill.textContent = `${progress.toFixed(1)}%`
    updateStats(transferred / 1024, totalSize, speed, elapsed, 'Transferring')

    if ((i + 1) % 5 === 0 || i === totalChunks - 1) {
      const chunkMsg = protocol === 'http' 
        ? `Sent chunk ${i + 1}/${totalChunks} (${(chunkSizeBytes / 1024).toFixed(1)} KB)`
        : `Data chunk ${i + 1}/${totalChunks} transferred (${(chunkSizeBytes / 1024).toFixed(1)} KB)`
      addLog(chunkMsg, 'info')
    }

    // Simulate network delay (50-150ms per chunk)
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100))
  }

  if (!stopRequested) {
    // Transfer complete
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    const avgSpeed = (totalSize / 1024) / elapsed

    if (protocol === 'http') {
      addLog(`Upload complete. Waiting for server response...`, 'info')
      await new Promise(resolve => setTimeout(resolve, 500))
      addLog(`HTTP/1.1 200 OK`, 'success')
      addLog(`Server: nginx/1.18.0`, 'info')
      addLog(`Content-Type: application/json`, 'info')
      addLog(`{"status": "success", "file": "${file.name}"}`, 'success')
      addLog(`Connection closed`, 'info')
    } else {
      addLog(`Data transfer complete`, 'success')
      await new Promise(resolve => setTimeout(resolve, 300))
      addLog(`226 Transfer complete`, 'success')
      addLog(`QUIT`, 'info')
      addLog(`221 Goodbye`, 'success')
    }

    updateStats(transferred / 1024, totalSize, avgSpeed, elapsed, 'Complete')
    addLog(`Transfer completed successfully in ${elapsed}s at ${avgSpeed.toFixed(1)} KB/s`, 'success')

    // Save transfer record to backend
    await saveTransferRecord(protocol, file, source, destination, mode, elapsed)
  }

  isTransferring = false
  transferBtn.style.display = 'block'
  stopBtn.style.display = 'none'
}

async function saveTransferRecord(protocol, file, source, destination, mode, duration) {
  try {
    const sourceIP = resolveDomainToIP(source)
    const destinationIP = resolveDomainToIP(destination)
    
    const formData = new FormData()
    formData.append('protocol', protocol)
    formData.append('file', file)
    formData.append('source', source)
    formData.append('sourceIP', sourceIP)
    formData.append('destination', destination)
    formData.append('destinationIP', destinationIP)
    formData.append('mode', mode)
    formData.append('duration', duration)
    formData.append('fileSize', file.size)
    formData.append('fileName', file.name)

    const res = await fetch('/api/v1/application/transfer/save', {
      method: 'POST',
      body: formData
    })

    const data = await res.json()
    
    if (res.ok && data.success) {
      addLog(`Transfer record saved: ${data.recordPath}`, 'success')
    } else {
      const errorMsg = data.error?.message || 'Failed to save transfer record'
      addLog(`Failed to save: ${errorMsg}`, 'error')
      showError('Save Failed', errorMsg)
    }
  } catch (err) {
    addLog(`Failed to save transfer record: ${err.message}`, 'error')
  }
}

// Form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  
  if (isTransferring) return

  const file = fileInput.files && fileInput.files[0]
  if (!file) {
    showError('No File Selected', 'Please select a file to transfer')
    return
  }

  // Validate file before transfer
  const validationErrors = validateFileBeforeTransfer(file)
  if (validationErrors.length > 0) {
    showError('File Validation Failed', validationErrors)
    return
  }

  const protocol = document.querySelector('input[name="protocol"]:checked').value
  const source = document.getElementById('source').value.trim()
  const destination = document.getElementById('destination').value.trim()
  const mode = document.getElementById('mode').value
  const chunkSize = parseInt(document.getElementById('chunkSize').value)

  // Validate inputs
  if (!source || !destination) {
    showError('Invalid Input', 'Source and destination hosts are required')
    return
  }

  if (isNaN(chunkSize) || chunkSize < 8 || chunkSize > 1024) {
    showError('Invalid Chunk Size', 'Chunk size must be between 8 and 1024 KB')
    return
  }

  await simulateTransfer(protocol, file, source, destination, mode, chunkSize)
})

stopBtn.addEventListener('click', () => {
  if (isTransferring) {
    stopRequested = true
    addLog('Stop requested...', 'info')
  }
})
