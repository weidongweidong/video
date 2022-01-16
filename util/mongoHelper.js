var mongoose = require('mongoose');
var _ = require('underscore');
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
  let table_name = database+"_"+table
  if (models[table_name]) {
    return models[table_name]
  }
  let pool = await this.pool(database)
  let model = pool.model(table, schema, table);
  models[table_name] = model
  return model

}

exports.find = async function (model, query, key, sorts) {
  let sortType = '';
  if (sorts) {
    sortType = sorts
  } else {
    sortType = '-updatedAt';
  }
  return new Promise((resolve, reject) => {
    let obj = query.obj;
    if (key) {
      let modelFind = model.pages(query.currentPage, query.pageSize)
      if(typeof obj === 'object') {
        for (index in obj) {
          if(obj[index] && typeof obj[index] !== 'boolean' && typeof obj[index] !== 'number') {
            if(typeof obj[index] === 'number') {
              modelFind.where(index, obj[index])
            } else {
              let reg = new RegExp(obj[index], 'i');
              modelFind.where(index, reg)
            }
          }
          if(typeof obj[index] === 'boolean' || typeof obj[index] === 'number') {
            modelFind.where(index, obj[index])
          }
        }
      }
      modelFind.populate(key)
        .sort(sortType)
        .exec(function (err, res) {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        })
    } else {
      let modelFind = model.pages(query.currentPage, query.pageSize)
      if(typeof obj === 'object') {
        for (index in obj) {
          if(obj[index] && typeof obj[index] !== 'boolean' && typeof obj[index] !== 'number') {
            if(typeof obj[index] === 'number') {
              modelFind.where(index, obj[index])
            } else {
              let reg = new RegExp(obj[index], 'i');
              modelFind.where(index, reg)
            }
          }
          if(typeof obj[index] === 'boolean' || typeof obj[index] === 'number') {
            modelFind.where(index, obj[index])
          }
        }
      }
      modelFind.sort(sortType)
        .exec(function (err, res) {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        });

        
    }
  })
};
exports.findList = async function (model, query, fields, options) {
    return new Promise((resolve, reject) => {
        model.find(query, fields, options, (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        })
    })
};
exports.findOne = async function (model, args, key) {
  return new Promise((resolve, reject) => {
    if (key) {
      model.findOne({_id: args})
        .populate(key)
        .exec(function (err, res) {
          if (err) {
            return reject(err);

          }
          return resolve(res);
        })
    } else {
      model.findOne({_id: args}, function (err, res) {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      })
    }
  })
};

exports.findOneNew = async function(model,query){
  return new Promise((resolve, reject)=>{
      model.findOne(query,function(err,res){
          if(err){
              reject(err)
              return
          }
          resolve(res)
      })
  })
}


//根据number查找
exports.findByNumber = async function (model, args) {
  return new Promise((resolve, reject) => {
    // if (key) {
    //   model.findOne({number: args})
    //     .populate(key)
    //     .exec(function (err, res) {
    //       if (err) {
    //         return reject(err);

    //       }
    //       return resolve(res);
    //     })
    // } else {
      model.findOne({number: args}, function (err, res) {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      })
    // }
  })
};


//根据number查找
exports.findByNum = async function (model, args) {
  return new Promise((resolve, reject) => {
      model.findOne({num:args}, function (err, res) {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      })
  })
};

//根据number查找
exports.findByDocName = async function (model, args) {
  return new Promise((resolve, reject) => {
    // if (key) {
    //   model.findOne({number: args})
    //     .populate(key)
    //     .exec(function (err, res) {
    //       if (err) {
    //         return reject(err);

    //       }
    //       return resolve(res);
    //     })
    // } else {
      model.findOne({doc_name: args}, function (err, res) {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      })
    // }
  })
};

exports.distinct = async function(model, args, query) {
  return new Promise((resolve, reject) => {
      model.distinct(args, query, function(err,res) {
          if(err) {
              reject(err)
              return
          }
          resolve(res)
      })
  })
}

exports.aggregate = async function(model,array){
  return new Promise((resolve, reject)=>{
      model.aggregate(array,function(err,res){
          if(err){
              reject(err)
              return
          }
          resolve(res)
      })
  })
}

exports.count = async function(model,query){
  return new Promise((resolve, reject)=>{
      model.count(query,function(err,res){
          if(err){
              reject(err)
              return
          }
          resolve(res)
      })
  })
}

exports.advertListSearch = async function (model, query) {
  return new Promise((resolve, reject) => {

    let advertsSql = model.pages(query.currentPage, query.pageSize);
    if (query.eventId) {
      let regEventId = new RegExp(query.eventId, 'i');
      advertsSql.where('ad_event.title', {$regex: regEventId});
    }
    if (query.ad_locationId.length > 0) {
      advertsSql.where('ad_location.locationId', query.ad_locationId);
    }
    if (query.advert_name) {
      let reg = new RegExp(query.advert_name, 'i');
      advertsSql.where('advert_name', {$regex: reg});
    }
    advertsSql
      .sort('-updatedAt')
      .exec(function (err, res) {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
  })
};
exports.advertEventListSearch = async function (model, query) {
  return new Promise((resolve, reject) => {

    let advertEventsSql = model.pages(query.currentPage, query.pageSize);
    if (query.title) {
      let reg = new RegExp(query.title, 'i');
      advertEventsSql.where('title', {$regex: reg});
    }
    if (query.is_valid && !(query.is_valid == '')) {
      advertEventsSql.where('is_valid', query.is_valid);
    }
    advertEventsSql
      .sort('-updatedAt')
      .exec(function (err, res) {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
  })
};


exports.findByOther = async function (model, query) {
  return new Promise((resolve, reject) => {
    if (query.type === "0") {
      // 'ad_location.locationId': query.locationId
      model.find({'ad_location.locationId': query.locationId})
        .exec(function (err, res) {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        })
    }
    if (query.type === "1") {
      let datetime = Date.now();
      // let datetime = moment(moment(Date.now()).format('YYYY-MM-DD')).format('X') * 1000

      let advertSql = model.find({is_valid: true});
      if (query.locationId) {
        advertSql.where('ad_location.locationId', query.locationId)
      }
      if (query.zhuanti_Id) {
        advertSql.where('zhuanti_Id', query.zhuanti_Id)
      }
      if (query.circleId) {
        advertSql.where('circleId', query.circleId)
      }
      if (query.userStage) {
        advertSql.where('userStage', query.userStage)
      }
      advertSql.sort('-weight -createdAt')
        .exec(function (err, res) {
        if (err) {
          return reject(err);
        }
        let result = [];
        res.forEach((val) => {
          let timeArr = val.timeSlots;
          let flag = _.find(timeArr, (item) => {
            return item.minDate <= datetime && datetime <= item.maxDate;
          });
          if (flag) {
            result.push(val);
          }
        });
        return resolve(result);
      })
    }
  })
};
exports.findGroupByType = async function (model, args) {
  return new Promise((resolve, reject) => {
    model.aggregate([
      { $group: {
          _id:"$type",
          info: { "$push":
              {"id":"$_id",
                "name":"$name",
                "type":"$type",
                "enter":"$enter",
                "hospital_id":"$hospital.id",
                "doctor_id":"$doctor.id",
              } },
          count: {$sum:1}
        }}
    ]).exec(function (err, result) {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    })
  })
};
exports.insert = async function (model, args) {
  return new Promise((resolve, reject) => {
    model.create(args, function (err, result) {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    })
  })
};

exports.update = async function (model, id, args) {
  return new Promise((resolve, reject) => {
    model.findById(id, function (err, queryData) {
      if (err) {
        return reject(err);
      } else {
        let schemaParams = _.extend(queryData, args);
        schemaParams.save(function (err, result) {
          if (err) {
            return reject(err);
          } else {
            return resolve(result);
          }
        })
      }
    })
  })
};
exports.delete = async function (model, args) {
  return new Promise((resolve, reject) => {
    model.remove({_id: args}, function (err, result) {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    })
  })
};

exports.updateNormal=async function(model,conditions,data,options) {
  return new Promise((resolve,reject)=>{
      model.update(conditions,data,options,function (err,res) {
          if(err){
              reject(err.message)
              return
          }
          resolve(res);
      })
  })
}