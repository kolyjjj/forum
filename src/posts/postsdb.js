import mongoose from 'mongoose';
import dbConfig from '../../env/db_config';

mongoose.connect(dbConfig.url);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to mongodb');
});

const Schema = mongoose.Schema;
const blogSchema = new Schema({
  title:{
    type: String,
    required: '{PATH} cannot be empty.', // PATH must be uppercase
    minlength: 4
  }, 
  author: String, 
  body: String,
  comments: [{body: String, date: Date}],
  date: {type: Date, default: Date.now},
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number
  }
});

const Blog = mongoose.model('Blog', blogSchema);

const postsdb = {
  save(data) {
    const aBlog = new Blog(data);
    return aBlog.save();    
  },
  getAll() {
    return Blog.find({});
  }
};

export default postsdb;
