import express from 'express';

const router = express.Router();

router.use(function timeLog(req, res, next){
    console.log('Time: ', Date.now());
    next();
    });

router.get('/', (req, res) => {
    res.send('hello, here is the api');
    });

export default router;
