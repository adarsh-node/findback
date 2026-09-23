export function validateEnvironment() {
  const requiredVariables = ['MONGODB_URI', 'JWT_SECRET']
  const missingVariables = requiredVariables.filter((name) => !process.env[name])

  if (missingVariables.length > 0) {
    console.error(`Missing required environment variables: ${missingVariables.join(', ')}.`)
    return false
  }

  return true
}
