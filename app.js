import express from 'express'; 
import routers from './src/routers';

let app = express();

app.use('/api', routers);

app.get('*', (req, res) => {
    res.status(404).send('What????');
    });

app.listen(3000, () => {
   console.log('Example app listening on port 3000!');
    });
