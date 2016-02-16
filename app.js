import express from 'express'; 
import bodyParser from 'body-parser';
import routers from './src/routers';

const app = express();

app.use('/api', bodyParser.json());
app.use('/api', routers);

app.get('*', (req, res) => {
  res.status(404).send('What????');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

export default app;
