import express from 'express';
import postsdb from './postsdb';
import lodash from 'lodash';

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

router.get('/:id', (req, res) => {
  postsdb.getOne(req.params.id).then((data)=>{
    if (lodash.isEmpty(data)) {
      console.log('cannot find post with id', req.params.id);
      res.status(404).send();
    } else
      res.status(200).json(data);
  }, (err)=>{
    console.log('error getting post', err);
    res.status(404).send();
  });
});

router.delete('/:id', (req, res) => {
  postsdb.deleteOne(req.params.id).then((data)=>{
    res.status(200).send();
  }, (err)=>{
    console.log('error deleting post', err);
    res.status(500).send();
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
