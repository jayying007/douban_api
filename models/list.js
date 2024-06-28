const load = require('../utils/load');
const { log, toNum } = require('../utils/utils');

const List = {
    /**
     *  根据关键词搜索列表
     *
     * @memberof Book
     */
    async list(req, res, baseUrl, catNum, pageSize) {
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
        let page = toNum(req.query.page, 1);
        let _url = `${baseUrl}?search_text=${encodeURIComponent(key)}&cat=${catNum}&start=${(page - 1) * pageSize}`;
        let $ = await load(_url);
        let _data = List.listAnalysis($, catNum);
        let endTime = Date.now();

        resData = {
            status: true,
            msg: '获取成功',
            time: (endTime - startTime) / 1000 + 's',
            data: _data
        }
        res.json(resData);
    },

    //搜索列表结构分析转数据
    listAnalysis($, catNum) {
        let data = [];
        let list = $('#wrapper #root .item-root');
        //信息
        list.each((i, item) => {
            let _$ = $(item);
            //详情页链接
            let cover_link = _$.find('.cover-link').attr('href');
            //封面图
            let cover = _$.find('.cover-link .cover').attr('src');
            //评分
            let rating = _$.find('.rating_nums').text();
            //摘要
            let abstract = List._abstractHandle(_$, catNum);
            
            let _data = {
                "detail_url": cover_link,
                "image_url": cover,
                rating,
                ...abstract
            };
            data.push(_data);
        });
        return data;
    },

    //摘要信息处理
    _abstractHandle(_$, catNum) {
        return List['_abstractHandle_' + catNum](_$);
    },

    //书籍摘要信息处理
    _abstractHandle_1001(_$) {
        log('书籍摘要信息处理');
        
        let title = _$.find('.title-text').text();
        let abstract = _$.find('.meta.abstract').text();
        return { title, abstract };
    },

    //影视摘要信息处理
    _abstractHandle_1002(_$) {
        log('影视摘要信息处理');

        let title = _$.find('.title-text').text();
        let abstract = _$.find('.meta.abstract').text();
        let actors = _$.find('.meta.abstract_2').text();
        return { title, abstract, actors };
    },

    //音乐摘要信息处理
    _abstractHandle_1003(_$) {
        log('音乐摘要信息处理');
        let abstract = _$.find('.meta.abstract').text();
        if (!abstract) {
            return {};
        }
        let title = _$.find('.title-text').text();
        let artist = '';
        let date = '';
        let album = '';
        let medium = '';
        let schools = '';
        let arr = abstract.split('/');
        arr = arr.map((item) => {
            return item.trim();
        });
        artist = arr.shift();
        date = arr.shift();
        album = arr.shift();
        medium = arr.shift();
        schools = arr.shift();
        return { title, artist, date, album, medium, schools };
    }
}

module.exports = List;