'use strict';

import express from 'express';
import lodash from 'lodash';
import usersdb from './usersdb';
import {wrap} from '../utils/utils';
import {NotFound} from '../errors/errors';

const router = express.Router();

router.post('/', wrap(async function(req, res, next){
  console.log('creating user', req.body);
  res.status(200).json('hello world');
}));

export default router;
