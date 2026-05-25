const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const PORT = process.env.PORT || 3001
const DATA_DIR = process.env.RENDER_DISK_MOUNT_PATH || path.join(__dirname, 'data')
const DATA_FILE = path.join(DATA_DIR, 'metas.json')

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ f: {}, t: {}, v: [] }))

app.use(express.json({ limit: '10mb' }))
app.use(express.static(path.join(__dirname)))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

app.get('/api/metas', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
    res.json(data)
  } catch (e) {
    res.json({ f: {}, t: {}, v: [] })
  }
})

app.put('/api/metas', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body))
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

app.listen(PORT, '0.0.0.0', () => {
  console.log('Servidor de Metas rodando na porta ' + PORT)
})
