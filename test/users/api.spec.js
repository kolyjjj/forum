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

  it('should get a user', function(done) {
    request(app)
    .post('/api/users/')
    .send(anUser)
    .expect(200)
    .end((err, res)=>{
      if (err) throw err;
      request(app)
      .get('/api/users/' + res.body.id)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        let body = res.body;
        body.name.should.be.exactly('koly');
        body.accountId.should.be.exactly('koly');
        body.email.should.be.exactly('kolyjjj@163.com');
        body.mobile.should.be.exactly('12345678901');
        should(body.password).be.undefined();
        done();
      });
    });
  });

  it('should get a list of users', function(done){
    request(app)
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) throw err;
      console.log('users', res.body);
      res.body.should.be.an.instanceOf(Array);
      done();
    });
  });
});
