import express from 'express';
import postsdb from './postsdb';

const router = express.Router();

router.get('/', (req, res) => {
    //postsdb.getAllPosts().then((data)=>{
    //    res.status(200).json(data);
    //    });
    postsdb.getAll().then((data)=>{
        console.log('getting all data');
        console.log(data);
        res.status(200).send(data);
    }, (err)=>{
        console.log(err);
        res.status(500).send(err);
    });
});

router.post('/', (req, res) => {
    console.log(req.body);
    postsdb.save(req.body).then((data) => {
        res.status(200).json({id: data._id});
    }, (err)=>{
        res.status(500).json(err);
    });
});

export default router;
