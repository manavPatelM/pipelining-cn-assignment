import fs from 'node:fs'
import path from 'node:path'

const OUTBOX_DIR = process.env.OUTBOX_DIR || path.resolve('outbox')

export function ensureOutbox() {
  if (!fs.existsSync(OUTBOX_DIR)) fs.mkdirSync(OUTBOX_DIR, { recursive: true })
  return OUTBOX_DIR
}

export function writeEnvelope(envelope) {
  ensureOutbox()
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  const base = `${ts}-${Math.random().toString(36).slice(2, 8)}`
  const jsonPath = path.join(OUTBOX_DIR, `${base}.json`)
  fs.writeFileSync(jsonPath, JSON.stringify(envelope, null, 2), 'utf-8')
  return jsonPath
}
