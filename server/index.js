import dotenv from 'dotenv'
import express from 'express'
import sql from 'mssql'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Find .env relative to this file, regardless of the terminal folder.
dotenv.config({
  path: fileURLToPath(new URL('../.env', import.meta.url)),
})

const connections = JSON.parse(readFileSync(new URL('./connections.json', import.meta.url), 'utf8'))

const app = express()
const port = 3001

// Return connection details without passwords.
app.get('/api/connections', (req, res) => {
  res.json(
    connections.map((connection) => ({
      id: connection.id,
      name: connection.name,
      server: connection.server,
      database: connection.database,
      user: connection.user,
    })),
  )
})

// Test the connection selected by its ID.
app.get('/api/test', async (req, res) => {
  const connection = connections.find((item) => item.id === req.query.id)

  if (!connection) {
    return res.status(400).json({
      connected: false,
      error: 'Select a valid connection first.',
    })
  }

  const password = process.env[connection.passwordEnv]

  if (!password) {
    return res.status(500).json({
      connected: false,
      error: 'The password for this connection is missing in .env.',
    })
  }

  const pool = new sql.ConnectionPool({
    server: connection.server,
    database: connection.database,
    user: connection.user,
    password,
    port: connection.port ?? 1433,

    options: {
      encrypt: true,
      trustServerCertificate: true,
    },

    connectionTimeout: 10000,
    requestTimeout: 10000,
  })

  try {
    await pool.connect()

    const result = await pool.request().query('SELECT DB_NAME() AS databaseName')

    res.json({
      connected: true,
      name: connection.name,
      database: result.recordset[0].databaseName,
    })
  } catch (error) {
    console.error('SQL connection failed:', error.code)

    res.status(503).json({
      connected: false,
      error: 'Could not connect. Check the selected server, login, and network.',
    })
  } finally {
    await pool.close().catch(() => {})
  }
})

app.listen(port, '127.0.0.1', () => {
  console.log(`Backend running at http://127.0.0.1:${port}`)
})
