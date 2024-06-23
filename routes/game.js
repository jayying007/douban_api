const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game');

//根据关键词搜索书籍列表
router.get('/list', gameController['GET list']);

//获取某本书籍的详细信息
router.get('/detail', gameController['GET detail']);

module.exports = router;