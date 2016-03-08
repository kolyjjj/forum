import express from 'express';
import lodash from 'lodash';
import postsdb from './postsdb';
import {wrap} from '../utils/utils';
import commentsdb from '../comments/commentsdb';

const router = express.Router();

let composeErrorJson = (errors) => {
  let result = {};
  for (let key in errors) {
    result[key] = errors[key].message;
  }
  return result;
};

let createResponseWhenPostNotFound = (data, id, res, successFunc) => {
  if (lodash.isEmpty(data)) {
    console.log('cannot find post with id', id);
    res.status(404).send();
  } else {
    successFunc(data);
  } 
};

router.get('/', (req, res) => {
  postsdb.getAll().then((data)=>{
    res.status(200).send(data);
  }, (err)=>{
    console.log('error when getting all posts', err);
    res.status(500).send(err);
  });
});

router.get('/:id', (req, res) => {
  postsdb.getOne(req.params.id).then((data)=>{
    createResponseWhenPostNotFound(data, req.params.id, res, (data)=>{
      res.status(200).json(data);
    });
  }, (err)=>{
    console.log('error getting post', err);
    res.status(404).send();
  });
});

router.delete('/:id', wrap(async function(req, res, next) {
  try {
    const comments = await commentsdb.getAll(req.params.id);
    if (comments !== null && comments.length > 0) {
      // forEach not working here
      //comments.forEach(function(c) {
      for (let c of comments) { 
        await commentsdb.deleteOne(c._id);
      }
      //});
    }
    console.log('post id', req.params.id);
    await postsdb.deleteOne(req.params.id);
    res.status(200).send();
  } catch (err) {
    console.log('deleting post error', err);
    res.status(404).send();
  }
}));

router.post('/', (req, res) => {
  console.log('request body for creating post', req.body);
  postsdb.save(req.body).then((data) => {
    res.status(200).json({id: data._id});
  }, (err)=>{
    console.log('creating post error', err);
    if ('ValidationError' === err.name) {
      let errorMessages = composeErrorJson(err.errors);
      res.status(400).json(errorMessages);
    }
    else res.status(500).json(err);
  });
});

router.put('/:id', (req, res)=>{
  console.log('request body for updating post', req.body);
  postsdb.update(req.params.id, req.body).then((data)=>{
    createResponseWhenPostNotFound(data, req.params.id, res, (data)=>{
      res.status(200).json(data);
    });
  }, (err)=>{
    if ('ValidationError' === err.name) {
      let errorMessages = composeErrorJson(err.errors);
      res.status(400).json(errorMessages);
    }
    else res.status(500).json(err);
  })
})

export default router;
