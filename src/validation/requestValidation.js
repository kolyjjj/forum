'use strict';

import logger from '../logger/index';

let gRules = {};

const validationFunctions = {
  required(val) {
    return val !== undefined && val !== null && val.length !== 0;
  },
  minLength(val, limit) {
    return val != undefined && val !== null && val.length >=limit; 
  }
};

const validateUsingValidationFunctions = (ruleName, val, option) => {
  if(option instanceof Array) {
    return validationFunctions[ruleName](val, option[0]);
  }
  return validationFunctions[ruleName](val);
};

const requestValidation = function(req, res, next) {
  logger.debug('request validation middleware');
  logger.debug('req method and base url', req.method, req.baseUrl);
  let errors = {};

  for (let ruleIndex in gRules) {
    let currentRule = gRules[ruleIndex];
    if (currentRule.method === req.method && currentRule.url === req.baseUrl) {
      let validations = currentRule.body;
      for (let k in req.body) {
        if (validations.hasOwnProperty(k)) {
          let errorsForOneField = [];
          for (let r in validations[k]) {
            if (!validateUsingValidationFunctions(r, req.body[k], validations[k][r])) {
              let msg = validations[k][r] instanceof Array ? validations[k][r][1] : validations[k][r];
              errorsForOneField.push(msg);
            }
          }
          if (errorsForOneField.length > 0)
            errors[k] = errorsForOneField;
        }
      }
    }
  }

  logger.debug('errors', errors);

  if (Object.keys(errors).length > 0 ) {
    res.status(400).send(errors);
    return;
  }
  next();
};

const kValidate = (rules) => {
  gRules = rules;
  return requestValidation;
};

export default kValidate;
