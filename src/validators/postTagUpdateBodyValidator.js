import Joi from 'joi';
import expressJoi from 'express-joi-validation';

const createValidator = expressJoi.createValidator;
const validator = createValidator({ passError: true });

const bodyValidator = Joi.object({
  tag: Joi.array().min(1).items(Joi.string().min(3)).required()});

export const postTagUpdateBodyValidator = validator.body(bodyValidator);
