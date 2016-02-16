'use strict';

import request from 'supertest';
import app from '../../app';

describe('GET /posts', ()=>{
  it('should get one post', function(done){
    request(app)
      .get('/api/posts')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
