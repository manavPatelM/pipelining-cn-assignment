// RLE Compression
function rleCompress(str) {
  let compressed = '';
  let count = 1;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i + 1]) {
      count++;
    } else {
      compressed += str[i] + (count > 1 ? count : '');
      count = 1;
    }
  }
  return compressed;
}

function rleDecompress(str) {
  let decompressed = '';
  let i = 0;
  while (i < str.length) {
    let char = str[i];
    let numStr = '';
    i++;
    while (i < str.length && !isNaN(str[i])) {
      numStr += str[i];
      i++;
    }
    let count = numStr ? parseInt(numStr) : 1;
    decompressed += char.repeat(count);
  }
  return decompressed;
}

// Generate Random Key
document.getElementById('generateKeyBtn').addEventListener('click', () => {
  const key = CryptoJS.lib.WordArray.random(16).toString();
  document.getElementById('secretKey').value = key;
  showStatus('steps', 'Random key generated successfully!', 'success');
});

// Process: Encrypt & Encode
document.getElementById('processBtn').addEventListener('click', () => {
  const text = document.getElementById('inputText').value;
  const key = document.getElementById('secretKey').value;

  if (!text) {
    showStatus('steps', 'Please enter text to process.', 'error');
    return;
  }
  if (!key) {
    showStatus('steps', 'Please enter a secret key.', 'error');
    return;
  }

  // Step 1: Base64 Encode
  const encoded = btoa(unescape(encodeURIComponent(text)));
  document.getElementById('encodedOutput').textContent = encoded;

  // Step 2: RLE Compress
  const compressed = rleCompress(encoded);
  document.getElementById('compressedOutput').textContent = compressed;

  // Step 3: AES Encrypt
  const encrypted = CryptoJS.AES.encrypt(compressed, key).toString();
  document.getElementById('encryptedOutput').textContent = encrypted;

  // Show sections with animation
  showSection('intermediateSection');
  showSection('outputSection');

  showStatus('steps', 'Processing complete! Data encrypted successfully.', 'success');
});

// Copy to Clipboard
document.getElementById('copyBtn').addEventListener('click', () => {
  const output = document.getElementById('encryptedOutput').textContent;
  navigator.clipboard.writeText(output).then(() => {
    showStatus('steps', 'Copied to clipboard!', 'success');
  });
});

// Download JSON
document.getElementById('downloadBtn').addEventListener('click', () => {
  const output = document.getElementById('encryptedOutput').textContent;
  const blob = new Blob([JSON.stringify({ encrypted: output }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'encrypted_data.json';
  a.click();
  showStatus('steps', 'File downloaded successfully!', 'success');
});

// Reset
document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('inputText').value = '';
  document.getElementById('secretKey').value = '';
  document.getElementById('steps').innerHTML = '';
  document.getElementById('fileInput').value = '';
  hideSection('intermediateSection');
  hideSection('outputSection');
});

// File Input Handler
document.getElementById('fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      document.getElementById('inputText').value = evt.target.result;
      showStatus('steps', `File "${file.name}" loaded successfully!`, 'success');
    };
    reader.readAsText(file);
  }
});

// Helper Functions
function showSection(id) {
  const section = document.getElementById(id);
  section.classList.remove('hidden');
  section.classList.add('fade-in');
}

function hideSection(id) {
  document.getElementById(id).classList.add('hidden');
}

function showStatus(elementId, message, type) {
  const el = document.getElementById(elementId);
  el.innerHTML = `<div class="status-message status-${type}">${message}</div>`;
  setTimeout(() => {
    if (el.innerHTML.includes(message)) {
      el.innerHTML = '';
    }
  }, 3000);
}