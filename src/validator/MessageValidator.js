const Joi = require('joi');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

class MessageValidator {

    async messageGetValidator(req, res, next) {
            
            const schema = Joi.object({
                society_id: Joi.string().required(),
                language_code: Joi.string().required(),
                region_id: Joi.string().required(),
                content_type: Joi.string().required()
            });
    
            // schema options
            const options = {
                abortEarly: false, // include all errors
                allowUnknown: true, // ignore unknown props
                stripUnknown: true, // remove unknown props
            };
    
            // validate request body against schema
            const { error, value } = schema.validate(req.body, options);
    
            if (error) {
                // on fail return comma separated errors
                const errorMessage = error.details
                    .map((details) => {
                        return details.message;
                    })
                    .join(', ');
                next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
            } else {
                // on success replace req.body with validated value and trigger next middleware function
                req.body = value;
                return next();
            }
        }

    async messageUpdateValidator(req, res, next) {
            
            const schema = Joi.object({
                society_id: Joi.string().required(),
                language_code: Joi.string().required(),
                region_id: Joi.string().required(),
                content_type: Joi.string().required(),
                messages: Joi.object().pattern(
                    Joi.string(),
                    Joi.array().items(Joi.string()).default([])
                ).required()
            });
    
            // schema options
            const options = {
                abortEarly: false, // include all errors
                allowUnknown: true, // ignore unknown props
                stripUnknown: true, // remove unknown props
            };
    
            // validate request body against schema
            const { error, value } = schema.validate(req.body, options);
    
            if (error) {
                // on fail return comma separated errors
                const errorMessage = error.details
                    .map((details) => {
                        return details.message;
                    })
                    .join(', ');
                next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
            } else {
                // on success replace req.body with validated value and trigger next middleware function
                req.body = value;
                return next();
            }
        }

}

module.exports = MessageValidator;