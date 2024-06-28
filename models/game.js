const load = require('../utils/load');
const { log, trims } = require('../utils/utils');

/**
 *  游戏类
 *
 * @class Game
 */
class Game {
    /**
     *  构造函数
     * @memberof Game
     */
    constructor() {
        //豆瓣游戏列表页URL
        this.gamePageUrl = 'https://www.douban.com/search';
        //搜索类目
        this.catNum = '3114';
    }

    /**
     *  根据关键词搜索游戏列表
     *
     * @memberof Game
     */
    async list(req, res) {
        log('根据关键词搜索游戏列表');
        
        let resData = {
            status: false,
            msg: '',
            data: null
        }

        let key = req.query.key;
        if (!key) {
            resData.msg = '参数有误';
            res.json(resData);
            return false;
        }

        let startTime = Date.now();
        let _url = `${this.gamePageUrl}?q=${encodeURIComponent(key)}&cat=${this.catNum}`;
        let $ = await load(_url);
        let _data = this.listAnalysis($);
        let endTime = Date.now();

        resData = {
            status: true,
            msg: '获取成功',
            time: (endTime - startTime) / 1000 + 's',
            data: _data
        }
        res.json(resData);
    }

    //搜索列表结构分析转数据
    listAnalysis($) {
        let data = [];
        let list = $('#wrapper .result-list .result');
        //信息
        list.each((i, item) => {
            let _$ = $(item);
            //详情页链接
            let cover_link = _$.find('.nbg').attr('href');
            let urlParam = this.getQueryParameter(cover_link, 'url');
            let decodedUrlParam = decodeURIComponent(urlParam);
            //封面图
            let cover = _$.find('.nbg').children().first().attr('src');
            //评分
            let rating = _$.find('.rating_nums').text();
            //标题
            let title = _$.find('.title h3 a').text();
            //摘要
            let abstract = _$.find('.subject-cast').text();

            let _data = {
                title,
                rating,
                abstract,
                "image_url": cover,
                "detail_url": decodedUrlParam
            };
            data.push(_data);
        });
        return data;
    }

    getQueryParameter(url, parameterName) {  
        // 创建一个新的URL对象  
        const parsedUrl = new URL(url);  
        // 获取查询字符串参数  
        const queryParams = new URLSearchParams(parsedUrl.search);  
        // 返回指定参数的第一个值，如果不存在则返回null  
        return queryParams.get(parameterName);  
    }

    /**
     *  获取某个游戏的详细信息
     *
     * @param {*} req
     * @param {*} res
     * @memberof Game
     */
    async detail(req, res) {
        log('获取某个游戏的详细信息');

        let resData = {
            status: false,
            msg: '',
            data: null
        }

        let url = req.query.url;
        if (!url) {
            resData.msg = '参数有误';
            res.json(resData);
            return false;
        }

        let startTime = Date.now();
        let $ = await load(url);
        let _data = this.detailAnalysis($);
        let endTime = Date.now();

        resData = {
            status: true,
            msg: '获取成功',
            time: (endTime - startTime) / 1000 + 's',
            data: _data
        }
        res.json(resData);
    }

    //获取某个游戏的详细信息
    detailAnalysis($) {
        let $wrap = $('#wrapper');
        let $content = $wrap.find('.article');
        //标题
        let title = $wrap.find('h1').text();
        //评分
        let rating = trims($content.find('.rating_wrap .rating_num').text());
        //图片
        let pic = $content.find('.pic img').attr('src');
        //信息
        let info = this.infoHandle($, $content);
        //简介
        let desc = $content.find('.item-desc p').text();
        return {
            title,
            rating,
            "image_url": pic,
            ...info,
            desc
        }
    }

    /**
     *  处理详情页的基本信息
     *
     * @param {*} $
     */
    infoHandle($, $content) {
        let info = {}
        let infoStr = $content.find('.thing-attr').text();
        let keyItem = $content.find('.thing-attr dt');
        keyItem.each((i, item) => {
            let key = $(item).text();
            let reg = new RegExp(`${key}:?[\\n\\s]+([^:]+)[\\n\\s]+([^\\n\\s]+:|$)`);
            let value = infoStr.match(reg);
            value = value ? trims(value[1]) : '';
            key = key.replace(/[:\s]+/, '');
            if (key.indexOf(':') !== -1 && !value) {
                let _keyArr = key.split(':');
                key = trims(_keyArr[0]);
                value = trims(_keyArr[1]);
            }
            info[key] = value;
        });
        return info;
    }
}

module.exports = new Game();