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
    minlength: [4, '{PATH} should be more than 4 characters.']
  }, 
  author: {
    type: String,
    required: '{PATH} cannot be empty.', 
    minlength: [2, '{PATH} should be more than 2 characters.'],
    maxlength: [40, '{PATH} should be less than 40 characters.']
  }, 
  content: {
    type: String,
    required: '{PATH} cannot be empty.',
    minlength: [15, '{PATH} should be more than 15 characters.']
  },
  comments: [{body: String, date: Date}],
  created_date: {type: Date, default: Date.now},
  last_edit_date: {type: Date, default: Date.now},
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
  update(id, data) {
    return Blog.findByIdAndUpdate(id, {
      title: data.title,
      content: data.content,
      last_edit_date: Date.now()
    }, {
      new: true,
      runValidators: true
    });
  },
  getAll() {
    return Blog.find({});
  },
  getOne(id) {
    return Blog.findById(id);
  },
  deleteOne(id) {
    return Blog.findByIdAndRemove(id);
  }
};

export default postsdb;
