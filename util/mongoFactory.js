const mongoose = require('mongoose');
const configs = require("../util/remoteConfig")
const pools = {}
const models = {}



exports.pool = async function (name) {
  if (pools[name]) {
    return pools[name]
  }
  let options = {
    server: {
      auto_reconnect: true,
      poolSize: 5
    }
  };

  var db = mongoose.createConnection(appSettings.mongodb[name], options);
  pools[name] = db;
  db.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
  });
  return db;
};

exports.getModel = async function (database, table, schema) {
  let table_name = database + "_" + table
  if (models[table_name]) {
    return models[table_name]
  }
  let pool = await this.pool(database)
  let model = pool.model(table, schema, table);
  models[table_name] = model
  return model

}

/**
 * find
 * @param model
 * @param query
 * @param fields
 * @param options
 * @returns {Promise<*>}
 */
exports.find = async function (model, query, fields, options) {
  return await model.find(query, fields, options);
};

/**
 * findOne
 * @param model
 * @param query
 * @param fields
 * @param options
 * @returns {Promise<*>}
 */
exports.findOne = async function (model, query, fields, options) {
  return await model.findOne(query, fields, options);
};

/**
 * distinct
 * @param model
 * @param query
 * @param fields
 * @param options
 * @returns {Promise<*>}
 */
exports.distinct = async function (model, field, query) {
  return await model.distinct(field, query);
};

/**
 * insert
 * @param model
 * @param object
 * @returns {Promise<*>}
 */
exports.insert = async function (model, object) {
  return await model.create(object);
};

/**
 * create many
 * @param model
 * @param listData
 * @returns {Promise<*>}
 */
exports.create = async function (model, listData) {
  return await model.create(listData);
};

/**
 * updateOne
 * @param model
 * @param query
 * @param updateParam
 * @returns {Promise<*>}
 */
exports.updateOne = async function (model, query, updateParam) {
  return await model.updateOne(query, updateParam, { multi: false });
};

/**
 * updateOne
 * @param model
 * @param query
 * @param updateParam
 * @returns {Promise<*>}
 */
exports.updateMany = async function (model, query, updateParam) {
  return await model.updateMany(query, updateParam, { multi: true });
};

/**
 * upsert
 * @param model
 * @param query
 * @param updateParam
 * @returns {Promise<*>}
 */
exports.upsert = async function (model, query, updateParam) {
  return await model.updateOne(query, updateParam, { multi: false, upsert: true });
};

/**
 * delete
 * @param model
 * @param query
 * @returns {Promise<*>}
 */
exports.delete = async function (model, query) {
  return await model.remove(query);
};


/**
 * deleteOne
 * @param model
 * @param query
 * @returns {Promise<*>}
 */
exports.deleteOne = async function (model, query) {
  return await model.deleteOne(query);
};

/**
 * count
 * @param model
 * @param query
 * @returns {Promise<*>}
 */
exports.count = async function (model, query) {
  return await model.countDocuments(query);
};
/**
 * aggregate
 * @param model
 * @param aggaregation
 * @returns {Promise<*>}
 */
exports.aggregate = async function (model, aggaregation) {
  return await model.aggregate(aggaregation);
}
/**
 * populate
 * 三张表联查
 * @param model
 * @param query
 * @param fields
 * @param options
 * @param populate
 */
exports.populate = async function (model, query, fields, options, populate) {
  return new Promise((resolve, reject) => {
    model.find(query, fields, options)
      .populate(populate[0])
      .populate(populate[1])
      .exec(function (err, doc) {
        if (err) {
          reject(err)
          return
        }
        resolve(doc)
      })
  })
}
/**
 * populate
 * 三张表联查
 * @param model
 * @param query
 * @param fields
 * @param options
 * @param populate
 */
exports.populateOne = async function (model, query, populate) {
  return new Promise((resolve, reject) => {
    model.findOne(query)
      .populate(populate[0])
      .populate(populate[1])
      .populate(populate[2])
      .exec(function (err, doc) {
        if (err) {
          reject(err)
          return
        }
        resolve(doc)
      })
  })
}
/**
 * populate
 * 两张表联查
 * @param model
 * @param query
 * @param fields
 * @param options
 * @param populate
 */
exports.populateForTwo = async function (model, query, fields, options, populate) {
  return new Promise((resolve, reject) => {
    model.find(query, fields, options)
      .populate(populate[0])
      .exec(function (err, doc) {
        if (err) {
          reject(err)
          return
        }
        resolve(doc)
      })
  })
}


/**
 * populate
 * 两张表联查
 * @param model
 * @param query
 * @param fields
 * @param options
 * @param populate
 */
exports.populateForThree = async function (model, query, fields, options, populate) {
  return new Promise((resolve, reject) => {
    model.find(query, fields, options)
      .populate(populate[0])
      .populate(populate[1])
      .populate(populate[2])
      .exec(function (err, doc) {
        if (err) {
          reject(err)
          return
        }
        resolve(doc)
      })
  })
}
/**
 * populate
 * 两张表联查 populate + aggregate
 * @param model
 * @param query
 * @param fields
 * @param options
 * @param populate
 */
exports.populateForAggregate = async function (model, args, populate, othermodel) {
  return new Promise((resolve, reject) => {
    model.aggregate(args)
      .exec(function (err, result) {
        othermodel.populate(result, populate[0], function(err, doc) {
          if(err) {
            reject(err)
            return
          }
          resolve (doc)
        })
      })
  })
}