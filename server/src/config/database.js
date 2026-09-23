import mongoose from 'mongoose'

const connectionStates = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
}

export async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured.')
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    })

    console.log('MongoDB connection established.')
  } catch (error) {
    console.error(`MongoDB connection failed (${error.name}).`)
    throw new Error('Database connection could not be established.')
  }
}

export function getDatabaseStatus() {
  return connectionStates[mongoose.connection.readyState] ?? 'unknown'
}
