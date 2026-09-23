import { validationResult } from 'express-validator'

export function validateRequest(request, response, next) {
  const errors = validationResult(request)

  if (errors.isEmpty()) {
    return next()
  }

  return response.status(422).json({
    message: 'Please correct the highlighted fields.',
    errors: errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    })),
  })
}
