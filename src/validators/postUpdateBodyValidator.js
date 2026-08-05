import Joi from 'joi';
import expressJoi from 'express-joi-validation';

const createValidator = expressJoi.createValidator;
const validator = createValidator({ passError: true });

const bodyValidator = Joi.object({
    status: Joi.string().valid('public', 'draft', 'delete','archived'),
    title: Joi.string().min(3).max(256),
    description: Joi.string().min(3),
    tag: Joi.array().items(Joi.string().min(3)),
    img: Joi.string()});


export const postUpdateBodyValidator = validator.body(bodyValidator);
