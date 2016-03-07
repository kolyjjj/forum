'use strict';

import express from 'express';
import lodash from 'lodash';
import co from 'co';
import {wrap} from '../utils/utils';
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

router.post('/', wrap(async function (req, res, next) {
    try{
      let aPost = await postsdb.getOne(req.params.id);
      if (lodash.isEmpty(aPost)) return next();
      let aComment = Object.assign({postId:req.params.id}, req.body); 
      let result = await commentsdb.save(aComment);
      res.status(200).json(result);
    } catch (err){
      console.log('err', err);
      if (err.kind === 'ObjectId') return res.status(404).json({message: 'cannot find post id'});
      res.status(400).json({message:'valiation error'});
    }
}));

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

router.delete('/:commentId', wrap(async function (req, res, next) {
 try {
   await commentsdb.deleteOne(req.params.commentId);
   res.status(200).send();
 } catch (err) {
   console.log('delete comment error', err);
   res.status(404).json({message: 'comment not found'});
 }
}));

export default router;
