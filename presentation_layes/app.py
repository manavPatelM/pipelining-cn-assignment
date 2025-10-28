from flask import Flask, request, jsonify, send_from_directory
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
import base64

app = Flask(__name__)

@app.route('/')
def index():
    # Serve the HTML file for the frontend
    return send_from_directory('.', 'index.html')

@app.route('/encrypt', methods=['POST'])
def encrypt():
    data = request.get_json()
    plaintext = data.get('plaintext', '')
    key = data.get('key', '')
    key_bytes = key.encode('utf-8')
    if len(key_bytes) not in (16, 24, 32):
        return jsonify({'error': 'Key must be 16, 24, or 32 bytes long'}), 400

    iv = get_random_bytes(16)
    cipher = AES.new(key_bytes, AES.MODE_CBC, iv)
    ct_bytes = cipher.encrypt(pad(plaintext.encode('utf-8'), AES.block_size))
    ciphertext = base64.b64encode(iv + ct_bytes).decode('utf-8')

    return jsonify({'ciphertext': ciphertext})

@app.route('/decrypt', methods=['POST'])
def decrypt():
    data = request.get_json()
    ciphertext_b64 = data.get('ciphertext', '')
    key = data.get('key', '')
    key_bytes = key.encode('utf-8')
    if len(key_bytes) not in (16, 24, 32):
        return jsonify({'error': 'Key must be 16, 24, or 32 bytes long'}), 400

    try:
        data_bytes = base64.b64decode(ciphertext_b64)
        iv = data_bytes[:16]
        ct_bytes = data_bytes[16:]
        cipher = AES.new(key_bytes, AES.MODE_CBC, iv)
        pt = unpad(cipher.decrypt(ct_bytes), AES.block_size)
        plaintext = pt.decode('utf-8')
        return jsonify({'plaintext': plaintext})
    except (ValueError, KeyError):
        return jsonify({'error': 'Decryption failed. Invalid key or ciphertext.'}), 400

if __name__ == '__main__':
    app.run(port=5000)
