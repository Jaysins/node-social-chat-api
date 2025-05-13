class CustomError extends Error {
  statusCode: number
  code: number | undefined
  keyPattern: Record<string, any> // Initialize errors as an empty object
  errors: Record<string, any> // Initialize errors as an empty object
  value: string

  constructor (message: string, statusCode: number, code: number, keyPattern: Record<string, any>, errors: Record<string, any>, value: string) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.keyPattern = keyPattern
    this.errors = errors
    this.value = value
  }
}

export default CustomError
