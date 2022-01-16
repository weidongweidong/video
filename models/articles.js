const mongoHelper = require('../../util/mongoHelper');
const mongoose = require('mongoose');

const articlesSchema = new mongoose.Schema({
    title: {
        type: String
    },
    brief: {
        type: String
    },
    author: {
        type: String
    },
    content: {
        type: String
    },
    periods: {
        type: String
    },
    large_img: {
        type: String
    },
    small_img: {
        type: String
    },
    show_img: {
        type: String
    },
    is_tuijian: {
        type: String
    },
    web_tags_id: {
        type: Array
    },
    tags_id: {
        type: Array
    },
    web_tags_name: {
        type: Array
    },
    web_tags_sign: {
        type: Array
    },
    create_at: {
        type: Date
    },
    visitCount: {
        type: Number
    },
    //后加的
    channel : {
        type: Array
    },
    tags_name : {
        type : Array
    },
    tags: {
        type: String
    },
});

const TABLE_NAME = "articles";
const DATABASE_NAME = "census";

exports = module.exports = {
    list: async function(query,page,limit,sort){
        let articlesModel = await mongoHelper.getModel(DATABASE_NAME, TABLE_NAME, articlesSchema)
        let options = {};
        if(!sort) {
          options = {sort: {weight: -1}}
        }else {
          options = {sort: sort}
        }
        page = page ? page : 1
        limit = limit ? limit : 10
        let data = await articlesModel.find(query, null, options).skip((page-1) * limit).limit(limit);
        return data;
    },
    findById: async function(id){
        let articlesModel = await mongoHelper.getModel(DATABASE_NAME, TABLE_NAME, articlesSchema)
        let result = await mongoHelper.findOne(articlesModel, {_id:id});
        return result
    },
    addVisitCount: async function(query) {
        let articlesModel = await mongoHelper.getModel(DATABASE_NAME, TABLE_NAME, articlesSchema)
        let result = await articlesModel.update(query, {$inc: {visitCount:1}})
        return result
    },
    Count: async function(query) {
        let model = await mongoHelper.getModel(DATABASE_NAME, TABLE_NAME, articlesSchema);
        return await model.count(query);
    },
};