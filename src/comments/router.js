'use strict';

import express from 'express';
import commentsdb from './commentsdb';

const router = express.Router();

router.get('/', (req, res)=>{
  res.status(200).send('hello, comments');
});

export default router;
