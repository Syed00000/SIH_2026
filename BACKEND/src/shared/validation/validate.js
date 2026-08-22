import { ValidationError } from '../errors/AppError.js';

export const validate = (schemas) => {
  return async (req, res, next) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        const details = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          details[path] = err.message;
        });
        return next(new ValidationError('Validation failed', details));
      }
      next(error);
    }
  };
};

export default validate;
