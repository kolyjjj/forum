'use strict';

const rules = {
  createUser: {
    method: 'POST',
    url: '/api/users/',
    body: {
      name: {
        required: 'name should be not empty'
      } 
    }
  }
};

const requestValidation = function(req, res, next) {
  console.log('request validation middleware');
  console.log('req method and base url', req.method, req.baseUrl);
  let errors = [];
  const createUserRules = rules.createUser.body;
  if (req.method === 'POST' && req.baseUrl === '/api/users') {
    for (let k in req.body) {
      if (createUserRules[k]) {
        if(createUserRules[k].hasOwnProperty('required') && req.body[k].length === 0) {
          let temp = {};
          temp[k] = createUserRules[k].required;
          errors.push(temp);
        }
      }
    }
  }
  console.log('errors', errors);
  if (errors.length > 0 ) {
    res.status(400).send({errors: errors});
    return;
  }
  next();
};

export default requestValidation;
