'use strict';

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.code = '404';
    this.type = 'NotFound'; // should be same as class name
  }
}

class PasswordNotMatch extends Error {
  constructor() {
    super('password mismatch');
    this.code = '400';
    this.type = 'PasswordNotMatch';
  }
}

export {NotFound, PasswordNotMatch};
