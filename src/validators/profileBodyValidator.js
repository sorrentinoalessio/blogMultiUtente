import Joi from 'joi';
import expressJoi from 'express-joi-validation';

const createValidator = expressJoi.createValidator;
const validator = createValidator({ passError: true});

const BodyValidator = Joi.object({
    name: Joi.string().min(3).max(256),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'it'] } }),
    password: Joi.string().min(8).max(256),
    avatar: Joi.string().uri()

})
export const profileBodyValidator = validator.body(BodyValidator);
