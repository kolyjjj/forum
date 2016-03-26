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
    console.log('excluded action', this.excludedAction);
    for (let elem of this.excludedAction) {
      console.log('=====', verb, url, elem.method, lodash.isEmpty(elem.method), elem.urlRegex, new RegExp('^' + elem.urlRegex + '$').test(url));
      const matchUrl = new RegExp('^' + elem.urlRegex + '$').test(url);
      if(lodash.isEmpty(elem.method) ? matchUrl : (elem.method.toUpperCase() === verb.toUpperCase() && matchUrl)){
          return true;
        }
    }
    return false;
  }
  //return lodash.some(this.excludedAction, function(e) {
  //console.log('=====', verb, url, lodash.isEmpty(e.method), e.urlRegex, new RegExp('^' + e.urlRegex + '$').test(url));
  //const matchUrl = new RegExp('^' + e.urlRegex + '$').test(url);
  //return lodash.isEmpty(e.method) ? matchUrl : (e.method.toUpperCase() === verb.toUpperCase() && matchUrl)});
  //}
};

export default authService;
