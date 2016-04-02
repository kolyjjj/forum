'use strict';

import createDefaultCRUD from '../database/defaultCRUD';

const schema = {
  name: String,
  accountId: String,
  password: String,
  email: String,
  mobile: String,
  role: String,
  create_time: Date,
  last_edit_time: Date
};

const usersdb = createDefaultCRUD('User', schema);

usersdb.updateOne = (id, data) => {
  let result = {
    "name": data.name,
    "email": data.email,
    "mobile": data.mobile,
    "last_edittime": Date.now()
  };
  return usersdb.update(id, result);
};

usersdb.updatePassword = (id, newPassword) => {
  let result = {
    "password": newPassword
  };
  return usersdb.update(id, result);
};

usersdb.getAllWithoutPasswordField = _ => {
  return usersdb.getAll().select('-password -role');
};

usersdb.getOneWithoutPasswordField = userId => {
  return usersdb.getOne(userId).select('-password -role');
};

usersdb.findByName = username => {
  return usersdb.findBy({accountId: username});
};

export default usersdb;
