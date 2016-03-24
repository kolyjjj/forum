'use strict';

import request from 'supertest';
import should from 'should';
import async from 'async';
import bcrypt from 'bcrypt-as-promised';
import app from '../../app';

describe('authentication', () => {
  let anUser = {
    "name": "koly",
    "accountId": "koly",
    "password":"123456",
    "email":"kolyjjj@163.com",
    "mobile": "12345678901"
  };

  it('should generate a token', function(done) {
    request(app)
    .post('/api/users')
    .send(anUser)
    .expect(200)
    .end((err, res) => {
        if (err) throw err;
        request(app)
        .post('/api/login')
        .send({
            "username": "koly",
            "password": "123456"
          })
        .expect(200)
        .end((err, res) => {
            if (err) throw err;
            res.body.token.should.be.an.instanceof(String);
            done();
          });
      });
    });

  it('should return 400 given invalid password', function(done) {
    request(app)
    .post('/api/users')
    .send(anUser)
    .expect(200)
    .end((err, res) => {
        if (err) throw err;
        request(app)
        .post('/api/login')
        .send({
            "username": "koly",
            "password": "12345"
          })
        .expect(400)
        .end((err, res) => {
            if (err) throw err;
            res.body.should.be.deepEqual({});
            done();
          });
      });
    });

  it('should return 404 given invalid username', function(done) {
    request(app)
    .post('/api/users')
    .send(anUser)
    .expect(200)
    .end((err, res) => {
        if (err) throw err;
        request(app)
        .post('/api/login')
        .send({
            "username": "koly11",
            "password": "123456"
          })
        .expect(404)
        .end((err, res) => {
            if (err) throw err;
            res.body.should.be.deepEqual({});
            done();
          });
      });
    });

  it('should return 403 if not logged in', function(done) {
      request(app)
      .post('/api/users')
      .send(anUser)
      .expect(403, done);
    });
});


