'use strict';

import lodash from 'lodash';

const parseActions = actions => {
  return actions.map(e => {
    const temp = e.split(' ');
    return temp.length > 1 ? {
      method: temp[0].trim(),
      urlRegex: temp[1].trim()
    } : {
        urlRegex: temp[0].trim()
      };
  });
};

const authService = {
  excludedAction: [],
  setExcludedAction(actions){
    this.excludedAction = parseActions(actions);
  },
  isExcludedAction(verb, url){
    console.log('verb url', verb, url);
    return lodash.some(this.excludedAction, e => lodash.isEmpty(e.method) ?
    new RegExp('^' + e.urlRegex + '$').test(url) :
    e.method.toUpperCase() === verb.toUpperCase() && new RegExp('^' + e.urlRegex + '$').test(url));
  }
};

export default authService;
