import Joi from 'joi';

export const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot be more than 50 characters'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Email is required'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.empty': 'Password is required'
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Passwords do not match',
        'string.empty': 'Please confirm your password'
      })
  });

  return schema.validate(data);
};

export const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Email is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'string.empty': 'Password is required'
      })
  });

  return schema.validate(data);
};

export const locationValidation = (data) => {
  const schema = Joi.object({
    sessionId: Joi.string()
      .required()
      .messages({
        'string.empty': 'Session ID is required'
      }),
    coordinates: Joi.object({
      latitude: Joi.number()
        .min(-90)
        .max(90)
        .required(),
      longitude: Joi.number()
        .min(-180)
        .max(180)
        .required()
    }).required(),
    accuracy: Joi.number()
      .min(0)
      .optional()
  });

  return schema.validate(data);
};

export const chatMessageValidation = (data) => {
  const schema = Joi.object({
    roomId: Joi.string()
      .required()
      .messages({
        'string.empty': 'Room ID is required'
      }),
    message: Joi.string()
      .max(1000)
      .required()
      .messages({
        'string.empty': 'Message cannot be empty',
        'string.max': 'Message cannot be longer than 1000 characters'
      }),
    type: Joi.string()
      .valid('text', 'image', 'video', 'audio', 'file')
      .default('text')
  });

  return schema.validate(data);
};