'use strict';

import createDefaultCRUD from '../database/defaultCRUD';

const schema = {
  name: String,
  accountId: String,
  password: String,
  email: String,
  mobile: String,
  create_time: Date,
  last_edit_time: Date
};

const usersdb = createDefaultCRUD('User', schema);

export default usersdb;
