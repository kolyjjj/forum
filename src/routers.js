import express from 'express';
import postRouter from './posts/router';

const router = express.Router();

router.use(function timeLog(req, res, next){
    console.log('Time: ', Date.now());
    next();
});

router.all('*', (req, res, next) => {
    const contentType = req.get('Content-Type');
    console.log('Content-Type', contentType, contentType.includes('application/json'));
    if (contentType && contentType.includes('application/json')) 
        next();
    else 
        res.status(400).send('wrong Content-Type, should be Content-Type:application/json, yours is ' + contentType);
});

router.get('/', (req, res) => {
    res.send('hello, here is the api');
});

router.use('/posts/', postRouter); 

export default router;
