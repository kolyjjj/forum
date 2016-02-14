import express from 'express';
import postsdb from './postsdb';

const router = express.Router();

let composeErrorJson = (errors) => {
  let result = {};
  for (let key in errors) {
    result[key] = errors[key].message;
  }
  return result;
}

router.get('/', (req, res) => {
  postsdb.getAll().then((data)=>{
    res.status(200).send(data);
  }, (err)=>{
    console.log('error when getting all posts', err);
    res.status(500).send(err);
  });
});

router.post('/', (req, res) => {
  console.log('request body for creating post', req.body);
  postsdb.save(req.body).then((data) => {
    res.status(200).json({id: data._id});
  }, (err)=>{
    console.log('creating post error', err);
    if ('ValidationError' === err.name) {
      let errorMessages = composeErrorJson(err.errors);
      res.status(400).json(errorMessages);
    }
    else res.status(500).json(err);
  });
});

export default router;
