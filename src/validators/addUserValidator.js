import Joi from 'joi';
import expressJoi from 'express-joi-validation';

const createValidator = expressJoi.createValidator;
const validator = createValidator({ passError: true });

const bodyValidator = Joi.object({
    name: Joi.string().required().min(3).max(256),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3),
    timeForHundredMeters: Joi.number()
        .positive()
        .custom((value, helpers) => {
            if (value === undefined || value === null) return value;
            const [, secondsStr] = value.toFixed(2).split('.');
            if (parseInt(secondsStr, 10) > 59) {
                return helpers.error('any.invalid');
            }
            return value;
        }, 'mm.ss time validation')
        .messages({
            'any.invalid': 'I secondi devono essere tra 00 e 59 (formato minuti.secondi, es. 1.30 = 1 minuto e 30 secondi)'
        })
});

export const addUserValidator = validator.body(bodyValidator);