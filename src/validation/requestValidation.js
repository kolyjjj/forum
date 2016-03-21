'use strict';

const rules = {
  createUser: {
    method: 'POST',
    url: '/api/users',
    body: {
      name: {
        required: 'should be not empty',
        minLength: [4, 'should be longer than 4 characters']
      },
      accountId: {
        required: 'should not be empty',
        minLength: [4, 'should be longer than 4 characters']
      },
      password: {
        required: 'should not be empty',
        minLength: [6, 'should be longer than 6 characters']
      },
      email: {
        required: 'should not be empty',
        minLength: [3, 'should be longer than 3 characters']
      }
    }
  }
};

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
  console.log('request validation middleware');
  console.log('req method and base url', req.method, req.baseUrl);
  let errors = {};

  for (let ruleIndex in rules) {
    let currentRule = rules[ruleIndex];
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

  console.log('errors', errors);
  if (Object.keys(errors).length > 0 ) {
    res.status(400).send(errors);
    return;
  }
  next();
};

export default requestValidation;
