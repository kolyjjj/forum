'use strict';

import express from 'express';
import lodash from 'lodash';
import bcrypt from 'bcrypt-as-promised';
import usersdb from './usersdb';
import {wrap} from '../utils/utils';
import {NotFound, PasswordNotMatch} from '../errors/errors';

const router = express.Router();

router.post('/', wrap(async function(req, res, next){
  try {
    console.log('creating user', req.body);
    let bcryptedPwd = await bcrypt.hash(req.body.password, 5);
    req.body.password = bcryptedPwd;
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

router.get('/', wrap(async function(req, res, next){
  try {
    let result = await usersdb.getAll();
    if (result === null) return next(new NotFound('cannot find users'));
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}));

router.put('/:id', wrap(async function(req, res, next) {
  try {
    let result = await usersdb.updateOne(req.params.id, req.body);
    if (result === null) return next(new NotFound('cannot find user'));
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}));

router.delete('/:id', wrap(async function(req, res, next){
  try {
    await usersdb.deleteOne(req.params.id);
    res.status(200).send();
  } catch (err) {
    next(err);
  }
}));

router.put('/:id/password', wrap(async function(req, res, next) {
  try {
    let user = await usersdb.getOne(req.params.id);
    if (lodash.isEmpty(user)) throw new NotFound('cannot find user with ' + req.params.id);

    try { await bcrypt.compare(req.body.oldPassword, user.password); }
    catch(err) { throw new PasswordNotMatch(); }

    let newPassword = await bcrypt.hash(req.body.newPassword);
    await usersdb.updatePassword(req.params.id, newPassword);
    res.status(200).send();
  } catch (err) {
    next(err);
  }
}));

export default router;
