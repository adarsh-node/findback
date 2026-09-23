import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function requireAuth(request, response, next) {
  const token = request.cookies.findback_access

  if (!token) {
    return response.status(401).json({ message: 'Authentication is required.' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.sub)

    if (!user) {
      return response.status(401).json({ message: 'Authentication is required.' })
    }

    request.user = user
    return next()
  } catch {
    return response.status(401).json({ message: 'Authentication is required.' })
  }
}
