const drop = document.getElementById('dropzone')
const fileInput = document.getElementById('file')
const form = document.getElementById('app-form')
const statusEl = document.getElementById('status')
const countEl = document.getElementById('count')
const messageEl = document.getElementById('message')
const pick = document.getElementById('pick')
const fileInfo = document.getElementById('fileInfo')
const senderInput = document.getElementById('sender')
const receiverInput = document.getElementById('receiver')
const senderIPEl = document.getElementById('senderIP')
const receiverIPEl = document.getElementById('receiverIP')

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

function updateIPDisplay(inputEl, displayEl) {
  const domain = inputEl.value.trim()
  if (!domain) {
    displayEl.textContent = ''
    return
  }
  
  const ip = resolveDomainToIP(domain)
  if (ip) {
    displayEl.textContent = `🌐 Resolved to: ${ip}`
  } else {
    displayEl.textContent = ''
  }
}

// Add input event listeners for real-time IP resolution
senderInput.addEventListener('input', () => {
  updateIPDisplay(senderInput, senderIPEl)
})

receiverInput.addEventListener('input', () => {
  updateIPDisplay(receiverInput, receiverIPEl)
})

function setDrag(active){ drop.classList.toggle('drag', !!active) }

;['dragenter','dragover'].forEach(ev=>{
  drop.addEventListener(ev, e=>{ e.preventDefault(); e.stopPropagation(); setDrag(true) })
})
;['dragleave','drop'].forEach(ev=>{
  drop.addEventListener(ev, e=>{ e.preventDefault(); e.stopPropagation(); setDrag(false) })
})

drop.addEventListener('click', ()=> fileInput.click())
pick && pick.addEventListener('click', ()=> fileInput.click())

drop.addEventListener('drop', e=>{
  const dt = e.dataTransfer
  if (dt && dt.files && dt.files.length>0) {
    fileInput.files = dt.files
    fileInfo.textContent = dt.files[0].name + ' • ' + (dt.files[0].size/1024).toFixed(1) + ' KB'
  }
})

fileInput.addEventListener('change', ()=>{
  const f = fileInput.files && fileInput.files[0]
  fileInfo.textContent = f ? (f.name + ' • ' + (f.size/1024).toFixed(1) + ' KB') : 'No file selected'
})

messageEl.addEventListener('input', ()=>{
  countEl.textContent = messageEl.value.length
})

// Validation and Transfer Simulation Functions
function addTransferLog(message, type = 'info') {
  const logEl = document.getElementById('transferLog')
  if (!logEl) return
  
  const time = new Date().toLocaleTimeString()
  const colors = {
    info: '#3b82f6',
    success: 'var(--good)',
    error: '#ef4444',
    warning: '#f59e0b'
  }
  
  const entry = document.createElement('div')
  entry.style.padding = '4px 0'
  entry.style.borderBottom = '1px solid var(--border)'
  entry.innerHTML = `<span style="color: var(--muted);">[${time}]</span> <span style="color: ${colors[type]};">${message}</span>`
  logEl.appendChild(entry)
  logEl.scrollTop = logEl.scrollHeight
}

function validateData(sender, receiver, message, file) {
  const errors = []
  const warnings = []
  const validations = []

  // Validate sender
  if (!sender || sender.trim().length === 0) {
    errors.push({ field: 'Sender', message: 'Sender is required' })
  } else if (sender.length > 100) {
    warnings.push({ field: 'Sender', message: 'Sender name is very long' })
  } else {
    validations.push({ field: 'Sender', message: 'Valid', status: 'success' })
  }

  // Validate receiver
  if (!receiver || receiver.trim().length === 0) {
    errors.push({ field: 'Receiver', message: 'Receiver is required' })
  } else if (receiver.length > 100) {
    warnings.push({ field: 'Receiver', message: 'Receiver name is very long' })
  } else {
    validations.push({ field: 'Receiver', message: 'Valid', status: 'success' })
  }

  // Validate content
  if (!message && !file) {
    errors.push({ field: 'Content', message: 'Either message or file is required' })
  } else {
    if (message && message.length > 0) {
      if (message.length > 10000) {
        warnings.push({ field: 'Message', message: `Message is very long (${message.length} chars)` })
      } else {
        validations.push({ field: 'Message', message: `${message.length} characters`, status: 'success' })
      }
    }
    
    if (file) {
      // File type validation
      const dangerousExts = ['.exe', '.bat', '.cmd', '.com', '.scr', '.msi', '.vbs', '.jar']
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      
      if (dangerousExts.includes(fileExt)) {
        errors.push({ field: 'File', message: `File type ${fileExt} is not allowed for security reasons` })
      } else if (file.size > 100 * 1024 * 1024) {
        errors.push({ field: 'File', message: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds 100MB limit` })
      } else if (file.size > 50 * 1024 * 1024) {
        warnings.push({ field: 'File', message: `Large file: ${(file.size / 1024 / 1024).toFixed(2)}MB` })
        validations.push({ field: 'File', message: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`, status: 'success' })
      } else {
        validations.push({ field: 'File', message: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`, status: 'success' })
      }
    }
  }

  return { errors, warnings, validations }
}

function displayValidationResults(errors, warnings, validations) {
  const listEl = document.getElementById('validationList')
  listEl.innerHTML = ''

  // Display errors
  errors.forEach(err => {
    const item = document.createElement('div')
    item.style.padding = '6px'
    item.style.marginBottom = '4px'
    item.style.background = '#2d1515'
    item.style.border = '1px solid #7f1d1d'
    item.style.borderRadius = '4px'
    item.innerHTML = `<strong style="color: #ef4444;">❌ ${err.field}:</strong> <span style="color: #fca5a5;">${err.message}</span>`
    listEl.appendChild(item)
  })

  // Display warnings
  warnings.forEach(warn => {
    const item = document.createElement('div')
    item.style.padding = '6px'
    item.style.marginBottom = '4px'
    item.style.background = '#2d2108'
    item.style.border = '1px solid #78350f'
    item.style.borderRadius = '4px'
    item.innerHTML = `<strong style="color: #f59e0b;">⚠️ ${warn.field}:</strong> <span style="color: #fcd34d;">${warn.message}</span>`
    listEl.appendChild(item)
  })

  // Display successful validations
  validations.forEach(val => {
    const item = document.createElement('div')
    item.style.padding = '6px'
    item.style.marginBottom = '4px'
    item.style.background = '#14342d'
    item.style.border = '1px solid #166534'
    item.style.borderRadius = '4px'
    item.innerHTML = `<strong style="color: var(--good);">✅ ${val.field}:</strong> <span style="color: #86efac;">${val.message}</span>`
    listEl.appendChild(item)
  })

  if (errors.length === 0 && warnings.length === 0 && validations.length === 0) {
    listEl.innerHTML = '<div style="color: var(--muted); padding: 6px;">No validation data</div>'
  }
}

async function simulateTransfer(dataSize, fileName = null, hasErrors = false, protocol = 'http', transferMode = 'binary', chunkSize = 32, senderIP = null, receiverIP = null) {
  const progressBar = document.getElementById('progressBar')
  const simStatus = document.getElementById('simStatus')
  const simSize = document.getElementById('simSize')
  const simProtocol = document.getElementById('simProtocol')

  if (hasErrors) {
    simStatus.textContent = 'Failed'
    simStatus.style.color = '#ef4444'
    addTransferLog('Transfer aborted due to validation errors', 'error')
    return
  }

  // Reset
  progressBar.style.width = '0%'
  progressBar.textContent = '0%'
  simStatus.textContent = 'Initializing'
  simSize.textContent = `${(dataSize / 1024).toFixed(2)} KB`
  simProtocol.textContent = `${protocol.toUpperCase()} (${transferMode.toUpperCase()})`

  const protocolUpper = protocol.toUpperCase()
  const modeDisplay = transferMode === 'binary' ? 'Binary' : 'ASCII'
  
  if (protocol === 'http' || protocol === 'https') {
    const port = protocol === 'https' ? '443' : '3000'
    addTransferLog(`Initializing ${protocolUpper} transfer...`, 'info')
    if (senderIP) addTransferLog(`Source: ${senderIP}`, 'info')
    if (receiverIP) addTransferLog(`Destination: ${receiverIP}`, 'info')
    addTransferLog('Connecting to application layer server...', 'info')
    await delay(300)

    addTransferLog(`Connection established on port ${port}`, 'success')
    addTransferLog(`${protocolUpper}/1.1 POST /api/v1/application/ui/submit`, 'info')
    addTransferLog('Content-Type: multipart/form-data', 'info')
    addTransferLog(`Transfer-Encoding: chunked (${chunkSize}KB chunks)`, 'info')
    addTransferLog(`Content-Transfer-Mode: ${modeDisplay}`, 'info')
    await delay(200)
  } else if (protocol === 'ftp') {
    addTransferLog('Initializing FTP transfer...', 'info')
    if (senderIP) addTransferLog(`Client IP: ${senderIP}`, 'info')
    if (receiverIP) addTransferLog(`Server IP: ${receiverIP}`, 'info')
    addTransferLog(`Connecting to ${receiverIP || 'server'}:21 (Control Channel)`, 'info')
    await delay(300)
    
    addTransferLog('220 FTP Server Ready', 'success')
    addTransferLog('USER application', 'info')
    await delay(150)
    addTransferLog('331 Password required', 'info')
    addTransferLog('PASS ******', 'info')
    await delay(150)
    addTransferLog('230 Login successful', 'success')
    const ftpMode = transferMode === 'binary' ? 'TYPE I (Binary Mode)' : 'TYPE A (ASCII Mode)'
    const ftpModeResp = transferMode === 'binary' ? '200 Switching to Binary mode' : '200 Switching to ASCII mode'
    addTransferLog(ftpMode, 'info')
    await delay(150)
    addTransferLog(ftpModeResp, 'success')
    addTransferLog('PASV (Entering Passive Mode)', 'info')
    await delay(150)
    addTransferLog('227 Entering Passive Mode', 'success')
    addTransferLog(`STOR ${fileName || 'message.json'}`, 'info')
    await delay(150)
    addTransferLog('150 Opening BINARY data connection', 'success')
  }

  // Simulate chunks with user-specified chunk size
  const chunkSizeBytes = chunkSize * 1024
  const chunks = Math.ceil(dataSize / chunkSizeBytes)
  simStatus.textContent = 'Transferring'
  
  addTransferLog(`Starting data transfer (${chunks} chunks of ${chunkSize}KB each)`, 'info')
  
  for (let i = 0; i < chunks; i++) {
    const progress = ((i + 1) / chunks) * 100
    progressBar.style.width = `${progress}%`
    progressBar.textContent = `${progress.toFixed(0)}%`
    
    if ((i + 1) % 3 === 0 || i === chunks - 1) {
      const chunkMsg = protocol === 'ftp' 
        ? `Data chunk ${i + 1}/${chunks} transferred`
        : `Transferred chunk ${i + 1}/${chunks}`
      addTransferLog(chunkMsg, 'info')
    }
    
    await delay(100)
  }

  addTransferLog('Data transfer complete', 'success')
  await delay(200)

  if (protocol === 'http' || protocol === 'https') {
    addTransferLog('Waiting for server response...', 'info')
    await delay(300)
    addTransferLog(`${protocolUpper}/1.1 201 Created`, 'success')
    addTransferLog('Content-Type: application/json', 'info')
    addTransferLog('Envelope saved to outbox/', 'success')
  } else if (protocol === 'ftp') {
    await delay(200)
    addTransferLog('226 Transfer complete', 'success')
    addTransferLog('QUIT', 'info')
    await delay(150)
    addTransferLog('221 Goodbye', 'success')
  }
  
  simStatus.textContent = 'Complete'
  simStatus.style.color = 'var(--good)'
  
  addTransferLog('Transfer completed successfully', 'success')
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

form.addEventListener('submit', async (e)=>{
  e.preventDefault()
  
  // Get form data
  const sender = document.getElementById('sender').value
  const receiver = document.getElementById('receiver').value
  const message = messageEl.value
  const file = fileInput.files && fileInput.files[0]
  
  // Resolve domain names to IPs
  const senderIP = resolveDomainToIP(sender)
  const receiverIP = resolveDomainToIP(receiver)
  
  // Show transfer section
  const transferSection = document.getElementById('transferSection')
  transferSection.style.display = 'block'
  
  // Clear previous logs
  const logEl = document.getElementById('transferLog')
  logEl.innerHTML = ''
  
  statusEl.textContent = 'Validating data...'
  statusEl.style.color = 'var(--accent)'
  
  // Validate data
  addTransferLog('Starting validation check...', 'info')
  const validation = validateData(sender, receiver, message, file)
  
  // Display validation results
  displayValidationResults(validation.errors, validation.warnings, validation.validations)
  
  if (validation.errors.length > 0) {
    statusEl.textContent = `Validation failed: ${validation.errors.length} error(s) found`
    statusEl.style.color = '#ef4444'
    addTransferLog(`Validation failed with ${validation.errors.length} error(s)`, 'error')
    
    // Simulate failed transfer
    await simulateTransfer(0, null, true)
    return
  }
  
  if (validation.warnings.length > 0) {
    addTransferLog(`${validation.warnings.length} warning(s) found, proceeding...`, 'warning')
  } else {
    addTransferLog('All validations passed', 'success')
  }
  
  // Calculate data size
  let dataSize = new Blob([sender, receiver, message || '']).size
  if (file) dataSize += file.size
  
  // Get selected protocol, transfer mode, and chunk size
  const protocol = document.getElementById('protocol').value
  const transferMode = document.getElementById('transferMode').value
  const chunkSize = parseInt(document.getElementById('chunkSize').value) || 32
  
  // Validate chunk size
  if (chunkSize < 8 || chunkSize > 1024) {
    statusEl.textContent = '❌ Invalid chunk size (must be between 8-1024 KB)'
    statusEl.style.color = '#ef4444'
    addTransferLog('Invalid chunk size specified', 'error')
    return
  }
  
  // Start transfer simulation
  addTransferLog('Validation complete, starting transfer...', 'success')
  addTransferLog(`Sender: ${sender} (${senderIP})`, 'info')
  addTransferLog(`Receiver: ${receiver} (${receiverIP})`, 'info')
  addTransferLog(`Transfer mode: ${transferMode.toUpperCase()}, Chunk size: ${chunkSize}KB`, 'info')
  const transferPromise = simulateTransfer(dataSize, file ? file.name : null, false, protocol, transferMode, chunkSize, senderIP, receiverIP)
  
  // Submit to backend
  statusEl.textContent = 'Saving to outbox...'
  statusEl.style.color = 'var(--good)'
  
  const fd = new FormData()
  fd.append('sender', sender)
  fd.append('receiver', receiver)
  fd.append('senderIP', senderIP)
  fd.append('receiverIP', receiverIP)
  fd.append('message', message)
  fd.append('format', document.getElementById('format').value)
  fd.append('protocol', protocol)
  fd.append('transferMode', transferMode)
  fd.append('chunkSize', chunkSize)
  if (file) fd.append('file', file)

  try {
    const res = await fetch('/api/v1/application/ui/submit', { method: 'POST', body: fd })
    const text = await res.text()
    
    // Wait for transfer simulation to complete
    await transferPromise
    
    if (res.ok) {
      statusEl.textContent = '✅ ' + text
      statusEl.style.color = 'var(--good)'
      addTransferLog('Backend confirmed: ' + text, 'success')
      
      // Send data to Presentation layer
      addTransferLog('Preparing data for Presentation layer...', 'info')
      try {
        const presentationRes = await fetch('/api/v1/application/send-to-presentation', { 
          method: 'POST', 
          body: fd 
        })
        const presentationData = await presentationRes.json()
        
        if (presentationRes.ok && presentationData.success) {
          addTransferLog('✅ Data sent to Presentation Layer (Layer 6)', 'success')
          addTransferLog(`Next: ${presentationData.instructions.next_step}`, 'info')
          console.log('Presentation Layer Data:', presentationData)
        } else {
          addTransferLog('⚠️ Failed to send to Presentation layer', 'warning')
        }
      } catch (presentationErr) {
        addTransferLog('⚠️ Presentation layer unavailable: ' + presentationErr.message, 'warning')
      }
      
      // Reset form after a delay
      setTimeout(() => {
        form.reset()
        fileInput.value = ''
        fileInfo.textContent = 'No file selected'
        countEl.textContent = '0'
      }, 1000)
    } else {
      statusEl.textContent = '❌ ' + text || 'Error occurred'
      statusEl.style.color = '#ef4444'
      addTransferLog('Backend error: ' + text, 'error')
    }
  } catch (err) {
    await transferPromise
    statusEl.textContent = '❌ Network error: ' + err.message
    statusEl.style.color = '#ef4444'
    addTransferLog('Network error: ' + err.message, 'error')
  }
})

// Add to Queue function
async function addToQueue() {
  const sender = document.getElementById('sender').value
  const receiver = document.getElementById('receiver').value
  const message = messageEl.value
  const file = fileInput.files && fileInput.files[0]
  
  // Validate
  if (!sender || !receiver) {
    alert('❌ Sender and receiver are required')
    return
  }
  
  if (!message && !file) {
    alert('❌ Either message or file is required')
    return
  }
  
  // Resolve IPs
  const senderIP = resolveDomainToIP(sender)
  const receiverIP = resolveDomainToIP(receiver)
  
  // Get config
  const protocol = document.getElementById('protocol').value
  const transferMode = document.getElementById('transferMode').value
  const chunkSize = parseInt(document.getElementById('chunkSize').value) || 32
  const format = document.getElementById('format').value
  
  // Prepare form data
  const fd = new FormData()
  fd.append('sender', sender)
  fd.append('receiver', receiver)
  fd.append('senderIP', senderIP)
  fd.append('receiverIP', receiverIP)
  fd.append('message', message)
  fd.append('format', format)
  fd.append('protocol', protocol)
  fd.append('transferMode', transferMode)
  fd.append('chunkSize', chunkSize)
  if (file) fd.append('file', file)
  
  try {
    statusEl.textContent = 'Adding to queue...'
    statusEl.style.color = 'var(--accent)'
    
    const res = await fetch('/api/v1/application/queue/add', {
      method: 'POST',
      body: fd
    })
    
    const data = await res.json()
    
    if (res.ok && data.success) {
      statusEl.textContent = `✅ Added to queue! Position: ${data.queueItem.position} | Queue size: ${data.queue.size}`
      statusEl.style.color = 'var(--good)'
      
      // Ask if user wants to go to queue manager
      setTimeout(() => {
        if (confirm('Message added to queue! Do you want to go to Queue Manager?')) {
          window.location.href = '/queue'
        } else {
          // Reset form
          form.reset()
          fileInput.value = ''
          fileInfo.textContent = 'No file selected'
          countEl.textContent = '0'
          statusEl.textContent = ''
        }
      }, 1000)
    } else {
      statusEl.textContent = '❌ ' + (data.error?.message || 'Failed to add to queue')
      statusEl.style.color = '#ef4444'
    }
  } catch (err) {
    statusEl.textContent = '❌ Network error: ' + err.message
    statusEl.style.color = '#ef4444'
  }
}

// Make addToQueue globally accessible
window.addToQueue = addToQueue
