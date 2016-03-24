'use strict';

import request from 'supertest';
import should from 'should';
import async from 'async';
import app from '../../app';

describe.only('/api/posts', ()=>{
  let aPost = {
    "title":"A new Post B",
    "author":"koly",
    "content":"Hello this is a post.",
    "comments":[],
    "hidden": false,
    "meta": {}
  };
  let token;

  before(function(done) {
    request(app)
    .post('/api/login')
    .send({
        "username":"koly",
        "password":"123456"
      })
    .expect(200)
    .end((err, res) => {
        if (err) throw err;
        console.log('res body', res.body);
        token = res.body.token;
        done();
      });
  });

  after(function(done){
    request(app)
      .get('/api/posts')
      .set('x-token', token)
      .expect('Content-Type', /json/)
      .end((err, res)=>{
        if (err) throw err;
        let deleteFuncs = [];
        res.body.forEach((value)=>{
          deleteFuncs.push((cb)=>{
            console.log('deleting', value._id);
            request(app)
              .delete('/api/posts/'+value._id)
              .set('x-token', token)
              .expect(200, cb);
          });
        });
        async.series(deleteFuncs, done);
      });
  });

  it('should get posts', function(done){
    console.log('token is', token);
    request(app)
      .get('/api/posts')
      .set({'x-token': token}) // cannot use 'token' here without 'x', otherwise node will not recognise it
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res)=>{
        if (err) throw err;
        console.log('getting posts');
        res.body.should.be.instanceof(Array);
        done();
      });
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

  it('should delete a post with comments', function(done){
    const aComment = {
      "author":"koy",
      "content":"this is a comment"
    };
    let postId;
    request(app)
      .post('/api/posts')
      .send(aPost)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res)=>{
        if (err) throw err;
        postId = res.body.id;
        request(app)
          .post('/api/posts/'+postId+'/comments')
          .send(aComment)
          .expect(200)
          .end((err, res)=>{
            if (err) throw err;
            request(app)
              .delete('/api/posts/'+postId)
              .expect(200)
              .end((err, res)=>{
                if (err) throw err;
                request(app)
                  .get('/api/posts/'+postId+'/comments')
                  .expect(200)
                  .expect((res)=>{
                    res.body.should.be.deepEqual([]);
                  })
                .end(done);
              });
          });
      });
  });

  describe('error handling', ()=>{
    it('should return 404 when getting post with invalid post id', function(done){
      request(app)
        .get('/api/posts/123124')
        .expect(404, done);
    });

    it('should return 404 when getting post with invalid post id which has same length', function(done){
      let postId;
      request(app)
        .post('/api/posts')
        .send(aPost)
        .expect(200)
        .expect(res => {
          postId = res.body.id;
        })
      .end((err, res)=>{
        if (err) throw err;
        let newPostId = (postId + 'xxx').substring(3);
        request(app)
          .get('/api/posts/' + newPostId)
          .expect(404, done);
      });
    });

    it('should return 400 when creating post with invalid data', function(done){
      request(app)
        .post('/api/posts')
        .send({
          "title":"",
          "author":"",
          "content":"",
          "comments":[],
          "hidden": false,
          "meta": {}
        })
      .expect(400)
        .end((err, res)=>{
          if (err) throw err;
          console.log('creating post error', res.body);
          res.body.should.be.deepEqual({
            "content": "content cannot be empty.",
            "author": "author cannot be empty.",
            "title": "title cannot be empty."
          });
          done();
        });
    });

    it('should return 404 when updating post with invalid post id', function(done){
      request(app)
        .put('/api/posts/123123')
        .send({
          "title":"one",
          "content":"two"
        })
      .expect(404, done);
    });

    it('should return 404 when deleting post with invalid post id', function(done){
      request(app)
        .delete('/api/posts/12312')
        .expect(404, done);
    });
  });
});
