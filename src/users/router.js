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
    res.status(200).json({id: result.id});
  } catch (err) {
    next(err);
  }
}));

export default router;
