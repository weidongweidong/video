/**
 * 发送http请求工具类
 * @module utils
 * @class http_util
 * @constructor
 */

const request = require('request');
var iconv = require('iconv-lite'); //引入模块
const Constants=require('../util/constants');

exports.requestToken = async function requestToken(opt) {
    return new Promise((resolve, reject) => {
        request(opt, (err, httpResponse, body) => {
            if (err) {
                return reject(err);
            }
            try {
                let result = body ? JSON.parse(body) : '';
                return resolve(result);
            } catch (e) {
                return reject(e);
            }
        })
    })
}

exports.httpGet = async function(urlPath, data){
    return new Promise((resolve, reject)=>{
        urlPath = encodeURI(parseGetParam(urlPath, data));
        request(urlPath, {timeout: 30000}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let result = JSON.parse(body);
                resolve(result)
            }else{
                resolve(null)
            }
        });
    })
};


exports.httpNormalGet = async function(urlPath, data){
    return new Promise((resolve, reject)=>{
        urlPath = encodeURI(parseGetParam(urlPath, data));
        request({url: urlPath, encoding: null}, (err, httpResponse, body)=>{
            if(err){
                resolve(null)
            }
            try{
                var buf = iconv.decode(body, 'gb2312').toString(); //解码gb2312
                resolve(eval(buf))
            }catch(e){
                resolve(null)
            }
        })
    })
};

exports.httpPost = async function(opt){
    return new Promise((resolve, reject)=>{
        opt.timeout = opt.timeout || 60000;
        request.post(opt , function(error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body)
            }else{
                console.log('接口请求：'+error)
                resolve(null)
            }
        });
    })
};

/**
 * put
 */
exports.httpPut = async function(opt){
  // console.log("httpPost-opt:", opt.url);
  return new Promise((resolve, reject)=>{
      opt.timeout = opt.timeout || 60000;
      request.put(opt , function(error, response, body) {
          console.log(body)
          if (!error && response.statusCode == 200) {
              resolve(JSON.parse(body))
          }else{
              console.log('接口请求：'+error)
              resolve(null)
          }
      });
  })
}


/**
 * 转化get参数
 * @param url
 * @param params
 */
function parseGetParam(url, params){
    let bf_str = '';
    if(url && url.indexOf("?")!=-1){
        bf_str = "&";
    }else{
        bf_str = "?";
    }
    if(params){
        let n = 0;
        for(let i in params){
            if(n==0){//至少有一个元素
                url+=bf_str;
                url+=i+"="+params[i];
            }else{
                url+="&"+i+"="+params[i];
            }
            n++;
        }
    }

    return url;
}

/**
 * get请求获取远程URL数据
 * @param {String} url
 * @param {Object} data
 * @param {Function} callback
 */
exports.get = function(url, data, callback){

    url = encodeURI(parseGetParam(url, data));
    request.get(url,{timeout:10000}, (err, httpResponse, body)=>{
        if(err){
            return callback(err, null);
        }
        try{
            let result = JSON.parse(body);
            return callback(null, result);
        }catch(e){
            return callback("获取失败~", null);
        }
    })
}

/**
 * post请求获取远程URL数据
 * @param {String} url
 * @param {Object} data
 * @param {Function} callback
 */
exports.post = (url, data, callback)=>{
    //LogUtil.log("&&&&&&&& url:"+url);
    //LogUtil.log("&&&&&&&&url_data:%j", data);
    request.post({url:url, form: data, timeout:10000}, (err, httpResponse, body)=>{
        if(err){
            return callback(err, null);
        }
        try{
            let result = JSON.parse(body);
            return callback(null, result);
        }catch(e){
            return callback("获取失败~", null);
        }
    })
}
//url末尾/的301跳转
exports.addUrl = function(req,res,next){
    var url = req.originalUrl;
    if(!url.endsWith('/')){
        url = url + '/';
        return res.redirect(301,url);
    }
}

//帖子集合页301重定向
exports.addUrl = function(req,res,next){
    var url = req.originalUrl;
    if(url=='/topic/list'){
        url = "/topic/list_2019/";
        return res.redirect(301,url);
    }
}


//医院详情页301重定向
exports.hostAddUrl = function(req,res,next){
    var url = req.originalUrl;
    if(url.indexOf('from') != -1){
        url = url.split("?")[0]
        return res.redirect(301,url);
    }
}


exports.existsUrlByGet = async function(urlPath){
    return new Promise((resolve, reject)=>{
        request(urlPath, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(true)
            }else{
                resolve(false)
            }
        });
    })
};

//新版医院URL重定向
exports.tonewHosUrl = function(req,res){
    try{
        let tempUrl = req.originalUrl;
        let url = "";
        let province_arr = Constants.shengshi_number;
        let province_two_arr = Constants.province;
        var province_english_name = "";
        var province_chinese_name = "";
    
        if(tempUrl.indexOf('location')!=-1 && tempUrl.indexOf('_')!=-1){
            let path = tempUrl.split('?')[1];
            if(path.indexOf('&') == -1){
                let newPath = path.replace('/','');
                let secondPath = newPath.split('=')[1];
                let thirdPath = secondPath.split('_');
                let province_num = thirdPath[0];
                let country_value = thirdPath[1];
             
               
                for(let i=0;i<province_arr.length;i++){
                    if(province_arr[i].value == province_num){
                        province_chinese_name = province_arr[i].name;
                    }
                }
                
                for(let j=0;j<province_two_arr.length;j++){
                    if(province_chinese_name == province_two_arr[j].name){
                        province_english_name = province_two_arr[j].value;
                    }
                }
                url = "/hospital/"+province_english_name+"/"+country_value+"/"
                
            }
        }else if(tempUrl.indexOf('location')!=-1 && tempUrl.indexOf('_') == -1){
            let path = tempUrl.split('?')[1];
            let firstPath = path.split('=')[1];
            for(let i=0;i<province_arr.length;i++){
                if(province_arr[i].value == firstPath){
                    province_chinese_name = province_arr[i].name;
                }
            }
            
            for(let j=0;j<province_two_arr.length;j++){
                if(province_chinese_name == province_two_arr[j].name){
                    province_english_name = province_two_arr[j].value;
                }
            }
            url = '/hospital/'+province_english_name+"/"
        }
        return res.redirect(301,url);
    }catch(error){
        console.log(console.error());
    }
   
}