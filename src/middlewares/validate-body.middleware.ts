import { NextFunction, Request, RequestHandler, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { StatusCodes } from 'http-status-codes';

import { cutObjectExtraProperties, parseValidateErrors } from '~src/helper/utils';

export default function validateBody<T>(
  Dto: any,
  validatorOptions: ValidatorOptions = { skipMissingProperties: false },
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const errors: Array<ValidationError> = await validate(plainToClass(Dto, req.body), validatorOptions);
    if (errors.length === 0) {
      const dto = new Dto();
      cutObjectExtraProperties(dto, req.body);
      req.body = { ...dto, ...req.body };
      return next();
    }
    return res.status(StatusCodes.BAD_REQUEST).json(parseValidateErrors(res, errors));
  };
}
