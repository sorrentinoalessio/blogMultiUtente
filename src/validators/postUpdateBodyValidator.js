import Joi from 'joi';
import expressJoi from 'express-joi-validation';
import { title } from 'process';

const createValidator = expressJoi.createValidator;
const validator = createValidator({ passError: true });

const bodyValidator = Joi.object({
    status: Joi.string().valid('public', 'draft', 'delete'),
    title: Joi.string().min(3).max(256), // titolo obligatorio
    description: Joi.string().min(3),// descrizione obligatorio
})

export const postUpdateBodyValidator = validator.body(bodyValidator);
