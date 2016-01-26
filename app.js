import express from 'express'; 
let app = express();

app.get('/', (req, res) => {
    res.send('Hello ExpressJS! It is slow, but it is working...');
});

app.listen(3000, () => {
   console.log('Example app listening on port 3000!');
    });
