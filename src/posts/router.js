import express from 'express';
import postsdb from './postsdb';

const router = express.Router();

router.get('/', (req, res) => {
    //postsdb.getAllPosts().then((data)=>{
    //    res.status(200).json(data);
    //    });
    res.send('posts');
});

router.post('/save', (req, res) => {
    console.log(req.body);
    postsdb.save(req.body).then((data) => {
        res.status(200).json({id: data._id});
    }, (err)=>{
        res.status(500).json(err);
    });
});

export default router;
