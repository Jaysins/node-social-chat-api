import Joi from 'joi'

export const JoiObjectId = (message = 'valid id') => Joi.string().regex(/^[0-9a-fA-F]{24}$/, message)

// Define the base schema with common options
export const baseSchema = Joi.object({
  // Add common fields here
  id: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date()

}).options({ stripUnknown: true })
