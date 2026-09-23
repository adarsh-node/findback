import { Router } from 'express'
import { body } from 'express-validator'
import { getProfile, login, logout, register } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'
import { validateRequest } from '../middleware/validate.js'

const router = Router()

const emailValidation = body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail()
const passwordValidation = body('password')
  .isString()
  .withMessage('Password is required.')
  .isLength({ min: 8, max: 72 })
  .withMessage('Password must be between 8 and 72 characters.')

router.post(
  '/register',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters.'),
    emailValidation,
    passwordValidation,
    validateRequest,
  ],
  register,
)
router.post('/login', [emailValidation, passwordValidation, validateRequest], login)
router.post('/logout', logout)
router.get('/me', requireAuth, getProfile)

export default router
