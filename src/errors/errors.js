'use strict';

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.code = '404';
    this.type = 'NotFound'; // should be same as class name
  }
}

export {NotFound};
