'use strict';

import express from 'express';
import bcrypt from 'bcrypt-as-promised';
import lodash from 'lodash';
import usersdb from './usersdb';
import {wrap} from '../utils/utils';
import {NotFound, PasswordNotMatch} from '../errors/errors';
import logger from '../logger/index';
import jwt from 'jsonwebtoken';

const router = express.Router();
const secret = 'koly123'; 

const jwtSign = (o, options) => new Promise((resolve, reject) => {
  try {
    jwt.sign(o, secret, {}, token => {
      resolve(token);
    })
  } catch(err) {
    reject(err);
  }
});

router.post('/', wrap(async function(req, res, next) {
  try {
    logger.debug('log in', req.body);
    let username = req.body.username;
    let password = req.body.password;
    let user = await usersdb.findByName(username);
    logger.debug('user found', user);
    if (lodash.isEmpty(user)) throw new NotFound('user not found with name ' + username);
    try { await bcrypt.compare(password, user.password); }
    catch (err) {throw new PasswordNotMatch(password, user.password);}
    let token = await jwtSign({username: username}, {expiresIn: '10h'}) 
    logger.debug('token generated', token);
    res.status(200).json({token: token});
  } catch (err) {
    next(err);
  }
}));

export default router;
