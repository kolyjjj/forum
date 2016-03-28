'use strict';

import request from 'supertest';
import should from 'should';
import async from 'async';
import app from '../../app';

describe('comments operation', ()=>{
  let aPost = {
    "title":"A new Post for comment test",
    "author":"koly",
    "content":"This is a post for testing comments",
    "hidden":false,
    "meta":[]
  };
  const aComment =  {
    "author":"koly",
    "content":"this is a comment"
  };
  let postId, token;

  before(function(done){
    request(app)
      .post('/api/users')
      .send({
        "name": "koly",
        "accountId": "koly",
        "password": "123456",
        "email": "kolyjjj@163.com",
        "mobile": "12345678901"
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
            request(app)
              .post('/api/posts')
              .set('x-token', token)
              .send(aPost)
              .expect((res)=>{
                postId = res.body.id;
              })
              .expect((err, res)=>{
                if (err) throw err;
              })
              .expect(200, done);
          });
      });
  });

  it('should create a comment', function(done){
    request(app)
      .post('/api/posts')
      .set('x-token', token)
      .send(aPost)
      .expect(200)
      .end((err, res)=>{
        if (err) throw err;
        request(app)
          .post('/api/posts/' + res.body.id + '/comments')
          .send(aComment)
          .expect('Content-Type', /json/)
          .expect((res)=>{
            res.body.should.have.property('_id');
          })
        .expect(200, done);
      });
  });

  it('should update a comment', function(done){
    request(app)
      .post('/api/posts/'+postId+'/comments')
      .send(aComment)
      .expect(200)
      .end((err, res) => {
        request(app)
          .put('/api/posts/'+postId+'/comments/'+res.body._id)
          .send({"author":"haha", "content":"hahahaha, comment"})
          .expect(res => {
            let body = res.body;
            body.author.should.be.exactly('haha');
            body.content.should.be.exactly('hahahaha, comment');
          })
        .expect(200, done);
      });
  });

  it('should get comments belong to a post', function(done){
    request(app)
      .post('/api/posts/'+postId+'/comments')
      .send(aComment)
      .expect(200)
      .end((err, res)=>{
        if (err) throw err;
        request(app)
          .get('/api/posts/'+postId+'/comments')
          .expect((res)=>{
            res.body.should.be.an.instanceOf(Array);
          })
        .expect(200, done);
      });
  });

  it('should delete a comment', function(done){
    request(app)
      .post('/api/posts/'+postId+'/comments')
      .send(aComment)
      .expect(200)
      .end((err, res) => {
        request(app)
          .delete('/api/posts/'+postId+'/comments/'+res.body._id)
          .expect(200, done);
      });
  });

});
