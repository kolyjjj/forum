'use strict';

import createModel from './index';
import lodash from 'lodash';

const filterInputWithSchema = (input, schema) => {
  let result = {};
  for (let key in schema) {
    if (!lodash.isEmpty(input[key])) 
      result[key] = input[key];
  }
  result.create_time = Date.now();
  result.last_edit_time = Date.now();
  return result;
};

const createDefaultCRUD = (modelName, schema) => {
  const Model = createModel(modelName, schema);
  return {
    save(data) {
      const aModel = new Model(filterInputWithSchema(data, schema));
      return aModel.save();
    },
    update(id, data) {
      console.log('updating model', id, data);
      return Model.findByIdAndUpdate(id, data, {new: true});
    },
    getAll() {
      return Model.find('-password');
    },
    getOne(id) {
      return Model.findById(id);
    },
    deleteOne(id) {
      return Model.findByIdAndRemove(id);
    }
  };
};

export default createDefaultCRUD;
