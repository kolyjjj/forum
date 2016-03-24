'use strict';

import express from 'express';
import lodash from 'lodash';
import jwt from 'jsonwebtoken';
import {NotFound} from '../errors/errors';
import logger from '../logger/index';
import db from '../../env/db_config';
import {wrap} from '../utils/utils';

const jwtVerify = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, 'koly123', {}, function(err, decoded) {
    if (err) reject(err);
    resolve(decoded);
  });
});

const excluded = ['login', 'posts', 'comments', 'users'];

const auth = wrap(async function(req, res, next) {
  console.log('base url in auth module', req.originalUrl);
  //if (excluded.indexOf(req.originalUrl.replace('/api/', '')) !== -1) return next();
  if (true) return next();
  try {
    console.log('token', req.header('x-token'), req.get('token'), req.cookie, req.params);
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
