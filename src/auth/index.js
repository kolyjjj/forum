'use strict';

import express from 'express';
import lodash from 'lodash';
import jwt from 'jsonwebtoken';
import {NotFound} from '../errors/errors';
import logger from '../logger/index';
import db from '../../env/db_config';
import {wrap} from '../utils/utils';
import authService from './service';

const jwtVerify = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, 'koly123', {}, function(err, decoded) {
    if (err) reject(err);
    resolve(decoded);
  });
});

const excluded = ['/api/login.*', '/api/posts.*', '/api/comments.*', '/api/users.*'];
console.log('setting excluded action', excluded);
authService.setExcludedAction(excluded);

const auth = wrap(async function(req, res, next) {
  logger.debug('auth module', req.method, req.originalUrl, authService.isExcludedAction(req.method, req.originalUrl));
  if (authService.isExcludedAction(req.method, req.originalUrl)) return next();
  //if (true) return next();
  try {
    const token = req.get('x-token') || req.cookie.token || req.params.token;
    const user = await jwtVerify(token);
    if (lodash.isEmpty(user)) throw new NotFound('cannot find user');
    logger.debug('user decoded', user);
  } catch (err) {
    logger.debug('authentication failed', err);
    res.status(403).send();
  }
  next();
});

export default auth;
