import express from 'express';
import lodash from 'lodash';
import postRouter from './posts/router';
import commentRouter from './comments/router';
import userRouter from './users/router';
import loginRouter from './users/login';
import kValidate from './validation/requestValidation';
import rules from './validation/rules';
import logger from './logger/index';

const router = express.Router();

router.use(function timeLog(req, res, next){
  logger.debug('Time:', Date.now());
  next();
});

router.all('*', function onlyAllowJson(req, res, next) {
  const method = req.method;
  if (lodash.includes(['GET', 'DELETE'], method)) next();
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

router.use('*', kValidate(rules));
router.use('/posts/', postRouter); 
router.use('/posts/:id/comments/', commentRouter);
router.use('/users/', userRouter);
router.use('/login/', loginRouter);

let composeErrorJson = (errors) => {
  let result = {};
  for (let key in errors) {
    result[key] = errors[key].message;
  }
  return result;
};

router.use((err, req, res, next)=>{
  // instanceof doesn't work here because of babeljs, it should work in pure ES6 environment
  //console.log('error handler', err instanceof NotFound, err);
  logger.debug('error handler', err);
  if (err.type === 'NotFound' || err.name === 'CastError') return res.status(404).send();
  if (err.name === 'ValidationError') return res.status(400).json(composeErrorJson(err.errors));
  if (err.type === 'PasswordNotMatch') return res.status(err.code).send();
  res.status(500).send();
});

export default router;
