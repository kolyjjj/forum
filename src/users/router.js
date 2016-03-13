'use strict';

import express from 'express';
import lodash from 'lodash';
import usersdb from './usersdb';
import {wrap} from '../utils/utils';
import {NotFound} from '../errors/errors';

const router = express.Router();

router.post('/', wrap(async function(req, res, next){
  try {
    console.log('creating user', req.body);
    let result = await usersdb.save(req.body);
    console.log('result', result);
    res.status(200).json({id: result._id});
  } catch (err) {
    next(err);
  }
}));

router.get('/:id', wrap(async function(req, res, next){
  try {
    console.log('getting user', req.params.id);
    let result = await usersdb.getOne(req.params.id);
    console.log('user got', result, lodash.isEmpty(result));
    if (lodash.isEmpty(result))  return next(new NotFound('cannot find user with id ' + req.params.id));
    result.password = undefined;
    console.log('=====', result);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}));

export default router;
