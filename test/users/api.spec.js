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
    "mobile": "12345678901",
    "role": "common"
  };
  let token;

  before(function(done) {
    request(app)
    .post('/api/users')
    .send({
      "name": "koly",
      "accountId": "koly",
      "password": "123456",
      "email": "kolyjjj@163.com",
      "mobile": "12345678901",
      "role": "admin" 
      })
    .expect(200)
    .end((err, res) => {
      if (err) throw err;

      request(app)
      .post('/api/login')
      .send({
        "username":"koly",
        "password":"123456"
      })
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        token = res.body.token;
        done();
        });
      });
  });

  after(function(done){
    request(app)
      .get('/api/users')
      .set('x-token', token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res)=>{
        if (err) throw err;
        let deleteFuncs = [];
        res.body.forEach(value => {
          deleteFuncs.push(cb => {
            request(app)
              .delete('/api/users/' + value._id)
              .set('x-token', token)
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
      .expect(200)
      .expect('Content-Type', /json/)
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
            should(body.role).be.undefined();
            done();
          });
      });
  });

  it('should update a user', function(done) {
    request(app)
      .post('/api/users')
      .send(anUser)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        let userId = res.body.id;
        request(app)
          .put('/api/users/'+userId)
          .set('x-token', token)
          .send({
            "name": "koly.li",
            "email": "email@email.com",
            "mobile": "12345678901"
          })
        .expect(200)
          .end((err, res) => {
            if (err) throw err;
            res.body.name.should.be.exactly("koly.li");
            res.body.email.should.be.exactly("email@email.com");
            res.body.mobile.should.be.exactly("12345678901");
            done();
          });
      });
  });

  it('should get a list of users', function(done){
    request(app)
      .post('/api/users/')
      .send(anUser)
      .expect(200)
      .end((err, res) => {
        request(app)
          .get('/api/users')
          .set('x-token', token)
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if (err) throw err;
            res.body.should.be.an.instanceOf(Array);
            should(res.body[0].password).be.undefined();
            should(res.body[0].role).be.undefined();
            done();
          });
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
          .delete('/api/users/' + userId)
          .set('x-token', token)
          .expect(200, done);
      });
  });

  it('should change password', function(done) {
    request(app)
      .post('/api/users')
      .send(anUser)
      .expect(200)
      .end((err, res)=> {
        if (err) throw err;
        let userId = res.body.id;
        request(app)
          .put('/api/users/' + userId + '/password')
          .set('x-token', token)
          .send({
            "oldPassword":"123456",
            "newPassword":"000abc"
          })
        .expect(200, done);
      });
  });

  it('should return 400 given invalid old password', function(done) {
    request(app)
      .post('/api/users')
      .send(anUser)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        let userId = res.body.id;
        request(app)
          .put('/api/users/'+ userId + '/password')
          .set('x-token', token)
          .send({
            "oldPassword": "123",
            "newPassword": "alskdjflsk",
          })
        .expect(400, done);
      });
  });

  describe('invalid request', _ => {
    it('should return 400 given empty fields  when creating user', function(done){
      request(app)
        .post('/api/users')
        .send({
          "name": "",
          "accountId": "",
          "password":"",
          "email":"",
          "mobile": ""
        })
      .expect(400)
        .end((err, res) => {
          if (err) throw err;
          res.body.should.be.deepEqual({
            name: [ 'should be not empty', 'should be longer than 4 characters' ],
            accountId: [ 'should not be empty', 'should be longer than 4 characters' ],
            password: [ 'should not be empty', 'should be longer than 6 characters' ],
            email: [ 'should not be empty', 'should be longer than 3 characters' ] 
          })
          done();
        });
    });
  });
});
