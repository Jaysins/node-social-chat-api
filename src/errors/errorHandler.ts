import { type Request, type Response, type NextFunction } from 'express'
import type CustomError from '../utils/customError'
import logger from '../utils/logger'
import { convertToTruth } from '../utils/helper'

const errorHandlerMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  const error = {
    statusCode: 500, // Default status code for internal server error
    msg: 'Something went wrong. Please try again later.'
  }
  logger.error(`Error occurred: ${err.stack}`)
  logger.error(`Request details: Method - ${req.method}, URL - ${req.originalUrl}`)
  logger.error(`Request headers: ${JSON.stringify(req.headers)}`)
  logger.error(`Request body: ${JSON.stringify(req.body)}`)
  console.log(err.name, err.message)
  console.log('sl')
  if (err.name === 'ValidationError') {
    error.msg = Object.values(err.errors).map((item) => item.message).join(',')
    error.statusCode = 400 // Bad Request
  } else if (['MongoServerError', 'MongoError'].includes(err.name) && err.code === 11000) {
    // Handle MongoDB duplicate key error
    error.msg = `Duplicate value entered for ${Object.keys(err.keyPattern)[0]} field. Please choose another value.`
    error.statusCode = 400
  } else if (err.name === 'CastError') {
    // Handle MongoDB duplicate key error
    error.msg = `No item found with ID: ${err.value}`
    error.statusCode = 400
  } else if (err.name === 'Error' && convertToTruth(err.message)) {
    console.log('lkksk')
    error.msg = err.message.replace(/_/g, '')
    error.statusCode = 409
  }
  console.log(err.name === 'Error', convertToTruth(err.message))
  console.log('ee===.', err.name, err.message)
  res.status(error.statusCode).json({ error: error.msg })
}

export default errorHandlerMiddleware
