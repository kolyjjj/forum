import mongoose from 'mongoose';
import dbConfig from '../../env/db_config';

mongoose.connect(dbConfig.url);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
  console.log('connected to mongodb');
});

const Schema = mongoose.Schema;

function createModel(name, schema) {
  return mongoose.model(name, new Schema(schema));
}

export default createModel;
