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

export default rules;
