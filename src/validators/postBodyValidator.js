import Joi from 'joi';
import expressJoi from 'express-joi-validation';

const createValidator = expressJoi.createValidator;
const validator = createValidator({ passError: true });

const bodyValidator = Joi.object({
    title: Joi.string().required().min(3).max(256), // titolo obligatorio
    description: Joi.string().required().min(3),// descrizione obligatorio
    status: Joi.string().valid('public', 'draft','delete','archived').default('draft'),// status di default mette draft
    tag: Joi.array().items(Joi.string().min(3).max(24)), // tag come array di stringhe
    img: Joi.string(),
    imagePost: Joi.string(),
    locality: Joi.string().uri({ scheme: ['http', 'https'] }).min(3).max(256), // deve essere un URL valido se presente
    levelScore: Joi.number().default(0)

}).unknown(true);

export const postBodyValidator = validator.body(bodyValidator);


