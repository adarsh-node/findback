import 'dotenv/config'
import app from './app.js'
import { connectDatabase } from './config/database.js'
import { validateEnvironment } from './config/environment.js'

const port = process.env.PORT || 5000

async function startServer() {
  try {
    if (!validateEnvironment()) {
      process.exit(1)
    }

    await connectDatabase()

    app.listen(port, () => {
      console.log(`FindBack API listening on http://localhost:${port}`)
    })
  } catch {
    console.error('FindBack API did not start because the database is unavailable.')
    process.exit(1)
  }
}

startServer()
