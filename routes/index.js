const express = require('express');
const router = express.Router();
const bookRouter = require('./book');
const movieRouter = require('./movie');
const musicRouter = require('./music');
const gameRouter = require('./game');

//书籍
router.use('/book', bookRouter);

//电影、电视、综艺
router.use('/movie', movieRouter);

//音乐
router.use('/music', musicRouter);

//游戏
router.use('/game', gameRouter);

module.exports = router;