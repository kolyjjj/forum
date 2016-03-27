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
    return lodash.some(this.excludedAction, function(e) {
      const matchUrl = new RegExp('^' + e.urlRegex + '$').test(url);
      return lodash.isEmpty(e.method) ? matchUrl : (e.method.toUpperCase() === verb.toUpperCase() && matchUrl)});
  }
};

export default authService;
