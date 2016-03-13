'use strict';

import request from 'supertest';
import should from 'should';
import app from '../../app';

describe.only('users api', ()=>{
  let anUser = {
    "name": "koly",
    "accountId": "koly",
    "password":"123456",
    "email":"kolyjjj@163.com",
    "mobile": "12345678901"
  };

  it('should create a new user', function(done){
    request(app)
    .post('/api/users/')
    .send(anUser)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res)=>{
      if (err) throw err;
      res.body.should.have.property('id') ;
      done();
    });
  });
});
