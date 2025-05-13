import { StatusCodes } from 'http-status-codes'
import CustomAPIError from './customApiError'

class ValidationError extends CustomAPIError {
  statusCode: number
  constructor (message: string) {
    super(message)
    this.statusCode = StatusCodes.CONFLICT
  }
}

export default ValidationError
