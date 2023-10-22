import Joi from "joi";

const contactCreateValidation = Joi.object({
  firstName: Joi.string().max(100).required(),
  lastName: Joi.string().max(100).optional(),
  email: Joi.string().email().max(200).optional(),
  phone: Joi.string().max(20).optional(),
});

const getContactValidation = Joi.number().positive().required();

const updateContactValidation = Joi.object({
  id: Joi.number().positive().required(),
  firstName: Joi.string().max(100).required(),
  lastName: Joi.string().max(100).optional(),
  email: Joi.string().email().max(200).optional(),
  phone: Joi.string().max(20).optional(),
});

const searchContactValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  name: Joi.string().optional(),
  email: Joi.string().optional(),
  phone: Joi.string().optional(),
});

export {
  contactCreateValidation,
  getContactValidation,
  updateContactValidation,
  searchContactValidation
}