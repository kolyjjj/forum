import express from 'express';
import lodash from 'lodash';
import postRouter from './posts/router';

const router = express.Router();

router.use(function timeLog(req, res, next){
  console.log('Time: ', Date.now());
  next();
});

router.all('*', function onlyAllowJson(req, res, next) {
  const method = req.method;
  if (lodash.includes(['GET'], method)) next();
  else {
    const contentType = req.get('Content-Type');
    if (contentType && contentType.includes('application/json')) 
      next();
    else 
      res.status(400).send('wrong Content-Type, should be Content-Type:application/json, yours is ' + contentType);
  }
});

router.post('*', function postShouldHasContent(req, res, next) {
  if (req.body && !lodash.isEmpty(req.body)) 
    next();
  else
    res.status(400).send('post should contain valid body');
});

router.get('/', (req, res) => {
  res.send('hello, welcome to the api');
});

router.use('/posts/', postRouter); 

export default router;
