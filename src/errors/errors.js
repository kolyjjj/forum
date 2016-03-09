'use strict';

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.code = 404;
  }
}

export {NotFound};
