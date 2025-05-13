import { StatusCodes } from 'http-status-codes'
import CustomAPIError from './customApiError'

class UnAuthenticatedError extends CustomAPIError {
  statusCode: number
  constructor (message: string) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

export default UnAuthenticatedError
