'use strict';

import request from 'supertest';
import app from '../../app';

describe('/api/posts', ()=>{
  let aPost = {
    "title":"A new Post B",
    "author":"koly",
    "content":"Hello this is a post.",
    "comments":[],
    "hidden": false,
    "meta": {}
  };

  it('should create one post', function(done){
    request(app)
    .post('/api/posts')
    .send(aPost)
    .expect('Content-Type', /json/)
    .expect((res)=>{
      console.log('body', res.body);
    })
    .expect(200, done);
  });

  it('should get one post', function(done){
    request(app)
    .post('/api/posts')
    .send(aPost)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res)=>{
      request(app)
      .get('/api/posts/' + res.body.id)
      .expect('Content-Type', /json/)
      .expect((res)=>{
        console.log('getting response', res.body);
      })
      .expect(200, done);
    });
  });
});
