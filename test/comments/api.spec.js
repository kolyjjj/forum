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

  it('should create a comment', function(done){
    request(app)
    .post('/api/posts')
    .send(aPost)
    .expect(200)
    .end((err, res)=>{
      if (err) throw err;
      console.log('post id', res.body.id);
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
});
