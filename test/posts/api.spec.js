'use strict';

import request from 'supertest';
import should from 'should';
import async from 'async';
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

  after(function(done){
    request(app)
    .get('/api/posts')
    .expect('Content-Type', /json/)
    .end((err, res)=>{
      if (err) throw err;
      let deleteFuncs = [];
      res.body.forEach((value)=>{
        deleteFuncs.push((cb)=>{
          console.log('deleting', value._id);
          request(app)
          .delete('/api/posts/'+value._id)
          .expect(200, cb);
        });
      });
      async.series(deleteFuncs, done);
    });
  });

  it('should get posts', function(done){
    request(app)
    .get('/api/posts')
    .expect('Content-Type', /json/)
    .expect((res)=>{
      console.log('getting posts');
      res.body.should.be.instanceof(Array);
    })
    .expect(200, done); // done should be here, if put done one line above and call it, it doesn't work
  });

  it('should create one post', function(done){
    request(app)
    .post('/api/posts')
    .send(aPost)
    .expect('Content-Type', /json/)
    .expect((res)=>{
      console.log('creating one post');
      res.body.should.have.property('id');
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
      if (err) throw err;
      request(app)
      .get('/api/posts/' + res.body.id)
      .expect('Content-Type', /json/)
      .expect((res)=>{
        console.log('getting a post');
        let body = res.body;
        body.title.should.be.exactly(aPost.title);
        body.author.should.be.exactly(aPost.author);
        body.content.should.be.exactly(aPost.content);
      })
      .expect(200, done);
    });
  });

  it('should update a post', function(done){
    request(app)
    .post('/api/posts')
    .send(aPost)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res)=>{
      if (err) throw err;
      request(app)
      .put('/api/posts/' + res.body.id)
      .send({
       "title":"updated post",
       "author":"another author",
       "content":"updated posts content"
      })
      .expect('Content-Type', /json/)
      .expect((res)=>{
        let body = res.body;
        body.title.should.be.exactly("updated post");
        body.author.should.be.exactly(aPost.author); // author cannot be udpated
        body.content.should.be.exactly("updated posts content");
        let timeDiff = Date.parse(body.last_edit_date) - Date.now();
        timeDiff.should.be.lessThan(10000); // 10000 is of scale milliseconds, which is 10 seconds
      })
      .expect(200, done);
    });
  });

  it('should delete a post', function(done){
    request(app)
    .post('/api/posts')
    .send(aPost)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res)=>{
      if (err) throw err;
      console.log('deleting');
      request(app)
      .delete('/api/posts/'+res.body.id)
      .expect(200, done);
    });
  });
});
