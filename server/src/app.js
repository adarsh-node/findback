import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { getDatabaseStatus } from './config/database.js'
import authRoutes from './routes/authRoutes.js'
import reportRoutes from "./routes/reportRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())
app.use("/api/reports", reportRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/notifications", notificationRoutes);


app.get('/api/health', (_request, response) => {
  const database = getDatabaseStatus()
  const isDatabaseConnected = database === 'connected'

  response.status(isDatabaseConnected ? 200 : 503).json({
    status: isDatabaseConnected ? 'ok' : 'unavailable',
    service: 'findback-api',
    database,
  })
})

app.use('/api/auth', authRoutes)

app.use((error, _request, response, _next) => {
  console.error("Unhandled API error:", error)
  response.status(500).json({
    message: "An unexpected error occurred.",
  })
})

export default app
