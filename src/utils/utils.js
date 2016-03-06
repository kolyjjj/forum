'use strict';

const wrap = fn => (...args) => fn(...args);

export {wrap};
