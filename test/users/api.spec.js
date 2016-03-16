'use strict';

import request from 'supertest';
import should from 'should';
import async from 'async';
import bcrypt from 'bcrypt-as-promised';
import app from '../../app';

describe('users api', ()=>{
  let anUser = {
    "name": "koly",
    "accountId": "koly",
    "password":"123456",
    "email":"kolyjjj@163.com",
    "mobile": "12345678901"
  };

  after(function(done){
    request(app)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res)=>{
        if (err) throw err;
        let deleteFuncs = [];
        res.body.forEach(value => {
          deleteFuncs.push(cb => {
            console.log('deleting user', value._id);
            request(app)
              .delete('/api/users/' + value._id)
              .expect(200, cb);
          });
        });
        async.series(deleteFuncs, done);
      });
  });

  it('should create a new user', function(done){
    request(app)
      .post('/api/users/')
      .send(anUser)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res)=>{
        if (err) throw err;
        res.body.should.have.property('id');
        bcrypt.hash('123456').then(data => {
          bcrypt.compare('123456', data).then(result => {
            result.should.be.exactly(true);
            done();
          });
        });
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
        res.body.should.be.an.instanceOf(Array);
        done();
      });
  });

  it('should delete an user', function(done){
    request(app)
      .post('/api/users')
      .send(anUser)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        let userId = res.body.id;
        request(app)
          .delete('/api/users/' + res.body.id)
          .expect(200, done);
      });
  });
});
