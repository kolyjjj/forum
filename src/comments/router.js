'use strict';

import express from 'express';
import commentsdb from './commentsdb';
import lodash from 'lodash';

const router = express.Router({mergeParams: true});

router.get('/', (req, res)=>{
  commentsdb.getAll(req.params.id).then((data)=>{
    res.status(200).json(data);
  }, (err)=>{
    console.log('failed to get all comments', err);
    res.status(500).send();
  });
});

router.post('/', (req, res, next)=>{
  let aComment = Object.assign({postId:req.params.id}, req.body); 
  commentsdb.save(aComment).then((data)=>{
    if (lodash.isEmpty(data)) return next();
    console.log('sending 200');
    res.status(200).send(data);
  }, (err)=>{
    console.log('fail to create comment', err);
    res.status(400).send();
  });
});

export default router;
