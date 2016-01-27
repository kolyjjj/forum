import express from 'express';
import postsdb from './postsdb';

const router = express.Router();

router.get('/', (req, res) => {
    //postsdb.getAllPosts().then((data)=>{
    //    res.status(200).json(data);
    //    });
    //res.status(200).send('posts');
});

router.post('/save', (req, res) => {
    console.log(req.body);
    res.send(req.body);
    /*
       postsdb.save().then((data) => {
       console.log('succeed');
       console.log(data);
       res.status(200).json(data);
       }, (err)=>{
       res.status(500).json(err);
       });
       */
});

export default router;
