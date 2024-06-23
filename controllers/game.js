const gameModel = require('../models/game');

const game = {
    //根据关键词搜索书籍列表
    'GET list': (req, res) => {
        gameModel.list(req, res);
    },

    //获取某本书籍的详细信息
    'GET detail': (req, res) => {
        gameModel.detail(req, res);
    }
}

module.exports = game;