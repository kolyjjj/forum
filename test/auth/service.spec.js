'use strict';

import should from 'should';
import authService from '../../src/auth/service';

describe('auth service', _ => {
  let originalActions = [];
  before(function(){
    originalActions = authService.excludedAction;
    console.log('+++++++original actions', originalActions);
    authService.setExcludedAction([
        'post /api/posts',
        'get /api/posts/.+',
        '/api/comments',
        '/api/users.*'
    ]);
  });

  after(function(){
    console.log('-----setting original actions back', originalActions);
    authService.excludedAction = originalActions;
  });

  it('should return true given excluded action', function() {
    const result = authService.isExcludedAction('post', '/api/posts');
    result.should.be.exactly(true);
  });

  it('should return true given excluded action which requires regex', function() {
    const result =  authService.isExcludedAction('get', '/api/posts/lkjdslfk123');
    result.should.be.exactly(true) ;
  });

  it('should return false given not excluded url', function() {
    const result = authService.isExcludedAction('get', '/api/posts');
    result.should.be.exactly(false);
  });

  it('should return false given not excluded verb', function() {
    const result = authService.isExcludedAction('delete', '/api/posts');
    result.should.be.exactly(false);
  });

  it('should return true when there is no verb in configuration', function(){
    const result = authService.isExcludedAction('get', '/api/comments');
    result.should.be.exactly(true);
  });

  it('should exclude all users action', function() {
    let result = authService.isExcludedAction('get', '/api/users');
    result.should.be.exactly(true);
    result = authService.isExcludedAction('get', '/api/users/ljsdlkf123');
    result.should.be.exactly(true);
    result = authService.isExcludedAction('put', '/api/users/ljsdlkf123');
    result.should.be.exactly(true);
    result = authService.isExcludedAction('post', '/api/users');
    result.should.be.exactly(true);
    result = authService.isExcludedAction('delete', '/api/users/lksjdfjk89');
    result.should.be.exactly(true);
    result = authService.isExcludedAction('POST', '/api/users/lksjdfjk89/posts');
    result.should.be.exactly(true);
  });
});
