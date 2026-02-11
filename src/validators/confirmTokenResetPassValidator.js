import Joi from 'joi';
import expressJoi from 'express-joi-validation';
import { isObjectIdOrHexString } from 'mongoose';

const createValidator = expressJoi.createValidator;
const validator = createValidator({ passError: true});

const confirmTokenResetPass = Joi.object({
    token: Joi.string().min(16).max(16).required()
})

export const confirmTokenValidator = validator.params(confirmTokenResetPass);