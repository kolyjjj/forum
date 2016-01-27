import express from 'express';
import postRouter from './posts/router';

const router = express.Router();

router.use(function timeLog(req, res, next){
    console.log('Time: ', Date.now());
    next();
});

router.get('/', (req, res) => {
    res.send('hello, here is the api');
});

router.use('/posts/', postRouter); 

export default router;
