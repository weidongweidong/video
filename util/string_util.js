/**
 * 字符串处理工具类
 * @module utils
 * @class string_util
 * @constructor
 */

const validator = require('validator')
const Constants = require('../util/constants');

/**
 * 帖子内容等处理 匹配掉标签符号
 * @author zhaopeng
 * @method dotreplace_length
 * @param {String} str
 * @return {String} 处理过后的文本内容
 */
exports.dotreplace_length = function (str) {
    if (!str) {
        return '';
    }
    return str.replace(/[&\|\\\*^%$#@\s\-。，, . 、；：？｜！“”（）·‘’]/g, "").length;
}

/**
 * 截取指定长度的字符串 超过长度则不截取
 * @author zhaopeng
 * @method substr_length
 * @param {String} str
 * @param {Number} length
 * @return {String} 截取后的字符串
 */
exports.substr_length = function (str, length) {
    if (str && str.length > length) {
        return str.substring(0, length);
    }
    return str;
}

/**
 * 手机号加*逻辑
 * @param str  要加星的字符串
 * @param frontLen  开始的坐标
 * @param endLen  结束的坐标
 * @returns {*}
 */
exports.plusXing = function (str, frontLen, endLen) {
    if (str && str.length > endLen) {
        var len = endLen - frontLen+1;
        var xing = '';
        for (var i = 0; i < len; i++) {
            xing += '*';
        }
        return str.substr(0, frontLen-1) + xing + str.substr(endLen, str.length);
    } else {
        return str;
    }
}

/**
 * 验证手机号
 * @param {String} phone 手机号
 * @returns {boolean}
 */
exports.isMobile = function isMobile(phone) {
    return validator.isMobilePhone(phone, 'zh-CN');
};

/**
 * 设置token
 */
exports.getToken= ()=>{
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

/**
 * 获取n位随机数
 */
exports.getRandomCodeByNum =  function getRandomCode(n){
    let Num="";
    for(let i=0;i<n;i++)  {
        Num+=Math.floor(Math.random()*10);
    }
    return Num;
}

/**
 * 图片与内容分离
 * @param content
 * @returns {*[]}
 */
exports.seprateContentAndImg = (content)=> {
    var reg = /(\!\[.*?\]\((.+?)\))/gi;
    var regM = content.match(reg);
    var imgsArr = [];
    if (regM) {
        for (var i = 0; i < regM.length; i++) {
            var imgStr = regM[i];
            if (/\((.+?)\)/.test(imgStr)) {
                var img = RegExp.$1;
                if (img.indexOf("qiniudn.com") != -1)
                    img = img + "?";
                imgsArr.push(img);
            }
        }
        var newContent = content.replace(reg, "\n");
        if (!newContent)
            newContent = "-";

        return [newContent, imgsArr];
    }
    else {
        return [content, []];
    }
}
/**
 * 匹配图片内容
 * @param content
 * @returns {string|XML|void|*}
 */
exports.checkOutImgContent = (content)=> {
    var reg = /(\!\[.*?\]\((.+?)\))/gi;
    return content.replace(reg, " [图片] ")
}
/**
 * 将关键词替换成内链
 * @param content 原文内容
 * @param keyword 要被替换的关键词
 * @param relace_content 关键词要替换成的内容
 */
function replaceKeywordToLink(content, keyword, relace_content){
    if(content){
        let reg = new RegExp(keyword, "g");
        return content.replace(reg, relace_content);
    }else{
        return content;
    }
}
exports.replaceKeywordToLink = replaceKeywordToLink;

/**
 * 所有将关键词替换成内链
 * @param content 原文内容
 * @param keyword 要被替换的关键词
 * @param relace_content 关键词要替换成的内容
 */
function replaceAllKeywordToLink(content){
    if(content){
        const INHERENT_LINK = Constants.INHERENT_LINK;
        for(let i in INHERENT_LINK){
            let reg = new RegExp(i, "g");
            content = content.replace(reg, `<object style="display:block;"><a href="${INHERENT_LINK[i]}" title="${i}">${i}</a></object>`);
            //content = content.replace(reg, `[${i}](${INHERENT_LINK[i]} "${i}")`);
        }
        return content;
    }else{
        return content;
    }
}
/**
 * 替换内链
 * @param content
 * @param link_list 内链 分等级 优先等级高的 一篇文章内链不能超过指定的数量
 */
function replaceInnerLinks(content, link_count, hot, link_list_obj, markdown) {
    try{
        if (link_count < 5) {
            if (link_list_obj[hot] && link_list_obj[hot].length > 0) {
                for (let i in link_list_obj[hot]) {
                    if (link_count < 5) {
                        let link = link_list_obj[hot][i];
                        if (content.indexOf(link.keyword) != -1) {
                            link_count++;
                            //LogUtil.log("【替换内链】：", link.keyword);
                            if(markdown){
                                content = content.replace(link.keyword, `[${link.keyword}](${link.link} "${link.keyword}")`);
                            }else{
                                link.link=link.link.replace('www','m');
                                content = content.replace(link.keyword, `<a href="${link.link}" style="display:inline;color:#ff6688;" target="_blank">${link.keyword}</a>`);

                               
                            }
                        }
                    } else {
                        break;
                    }
                }
            }
            if (hot > 0) {
                hot--;
                return replaceInnerLinks(content, link_count, hot, link_list_obj, markdown);
            } else {
                return content;
            }
        } else {
            return content;
        }
    }catch(e){
        return content;
    }

}
/**
 * 替换内链 不会重复替换
 * @param content
 * @param link_list 内链 分等级 优先等级高的 一篇文章内链不能超过指定的数量
 */
function replaceInnerLinksNoRepeat(content, link_count, hot, link_list_obj, markdown, replacedwords) {
    try{
        if (link_count < 5) {
            if (link_list_obj[hot] && link_list_obj[hot].length > 0) {
                for (let i in link_list_obj[hot]) {
                    if (link_count < 5) {
                        let link = link_list_obj[hot][i];
                        if (content.indexOf(link.keyword) != -1 && !replacedwords[link.keyword]) {
                            replacedwords[link.keyword] = 1;
                            link_count++;
                            //LogUtil.log("【替换内链】：", link.keyword);
                            if(markdown){
                                content = content.replace(link.keyword, `[${link.keyword}](${link.link} "${link.keyword}")`);
                            }else{
                                content = content.replace(link.keyword, `<a href="${link.link}" title="${link.keyword}" target="_blank">${link.keyword}</a>`);
                            }
                        }
                    } else {
                        break;
                    }
                }
            }
            if (hot > 0) {
                hot--;
                return replaceInnerLinksNoRepeat(content, link_count, hot, link_list_obj, markdown, replacedwords);
            } else {
                return content;
            }
        } else {
            return content;
        }
    }catch(e){
        return content;
    }

}
exports.replaceAllKeywordToLink = replaceAllKeywordToLink;//替换部分超链接
exports.replaceInnerLinks = replaceInnerLinks;//替换内链
exports.replaceInnerLinksNoRepeat = replaceInnerLinksNoRepeat;//替换内链 不重复