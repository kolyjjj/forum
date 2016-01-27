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
    title: String, 
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
let aBlog = new Blog({
    title: 'first blog',
    author: 'koly',
    body: 'What a beautiful world',
    comments: [{body: 'a comment', date: Date.now()}],
    hidden: false,
    meta: {
        votes: 1,
    favs: 1
    }
});

console.log(aBlog.title + '->' + aBlog.author + '->' + aBlog.body);

const postsdb = {
    save() {
        return aBlog.save();    
    }
};

export default postsdb;
