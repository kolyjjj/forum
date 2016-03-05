'use strict';

import express from 'express';
import lodash from 'lodash';
import commentsdb from './commentsdb';
import postsdb from '../posts/postsdb';

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
  postsdb.getOne(req.params.id)
  .then((data)=>{
    if (lodash.isEmpty(data)) return next();

    let aComment = Object.assign({postId:req.params.id}, req.body); 
    commentsdb.save(aComment).then((data)=>{
      res.status(200).send(data);
    }, (err)=>{
      console.log('fail to create comment', err);
      res.status(400).send();
    });
  }, (err)=>{
    res.status(404).json({message: 'cannot find post id.'});
  });
});

router.put('/:commentId', (req, res, next) => {
 postsdb.getOne(req.params.id)
 .then(data => {
   if (lodash.isEmpty(data)) return next();

   let newComment = req.body;
   commentsdb.update(req.params.commentId, newComment)
   .then(data=>{
     res.status(200).send(data);
   }, err => {
     console.log('fail to update comment', err);
     res.status(400).send();
   });
 }, err => {
   console.log('updating comments ' + req.params.commentId + ' error with post id ' + req.params.id);
   res.status(404).json({message: 'cannot find post id.'});
 });
});

export default router;
