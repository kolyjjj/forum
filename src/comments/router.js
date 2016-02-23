'use strict';

import express from 'express';
import commentsdb from './commentsdb';

const router = express.Router({mergeParams: true});

router.get('/', (req, res)=>{
  commentsdb.getAll(req.params.id).then((data)=>{
    res.status(200).json(data);
  }, (err)=>{
    console.log('failed to get all comments', err);
    res.status(500).send();
  });
});

router.post('/', (req, res)=>{
  let aComment = Object.assign({postId:req.params.id}, req.body); 
  commentsdb.save(aComment).then((data)=>{
    console.log('creating comment successfully', data);
    res.status(200).send(data);
  }, (err)=>{
    console.log('fail to create comment', err);
    res.status(400).send();
  });
});

export default router;
