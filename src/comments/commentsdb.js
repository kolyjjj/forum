'use strict';

import createModel from '../database/index';

const schema = {
  post_id: {
    type: String,
    required: '{PATH} cannot be empty.'
  },
  author: {
    type: String,
    required: '{PATH} cannot be empty.',
    minlength: [2, '{PATH} should be more than 2 characters'],
    maxlength: [40, '{PATH} should be less than 40 characters']
  },
  content: {
    type: String,
    required: '{PATH} cannot be empty'
  },
  created_date: {
    type: Date, 
    default: Date.now
  },
  last_edit_date: {
    type: Date,
    default: Date.now
  }
};

const Comment = createModel('Comment', schema);

const commentsdb = {
  save(data){
    const aComment = new Comment({
      post_id: data.postId,
      author: data.author,
      content: data.content,
      created_date: Date.now(),
      last_edit_date: Date.now()
    });
    return aComment.save();
  }
};

export default commentsdb;
