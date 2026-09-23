import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { createAccessToken, publicUser, sendAuthCookie, clearAuthCookie } from '../utils/auth.js'

const saltRounds = 12

function sendAuthenticatedUser(response, user, statusCode = 200) {
  const token = createAccessToken(user.id)
  sendAuthCookie(response, token)
  response.status(statusCode).json({ user: publicUser(user) })
}

export async function register(request, response, next) {
  try {
    const { name, email, password } = request.body
    const normalizedEmail = email.toLowerCase().trim()
    const existingUser = await User.exists({ email: normalizedEmail })

    if (existingUser) {
      return response.status(409).json({ message: 'An account already exists for this email address.' })
    }

    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = await User.create({ name, email: normalizedEmail, password: passwordHash })
    return sendAuthenticatedUser(response, user, 201)
  } catch (error) {
    if (error?.code === 11000) {
      return response.status(409).json({ message: 'An account already exists for this email address.' })
    }

    return next(error)
  }
}

export async function login(request, response, next) {
  try {
    const { email, password } = request.body
    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: normalizedEmail }).select('+password')

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return response.status(401).json({ message: 'Invalid email or password.' })
    }

    return sendAuthenticatedUser(response, user)
  } catch (error) {
    return next(error)
  }
}

export function logout(_request, response) {
  clearAuthCookie(response)
  response.status(204).send()
}

export function getProfile(request, response) {
  response.status(200).json({ user: publicUser(request.user) })
}
