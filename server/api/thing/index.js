'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/admin', controller.adminInsert);

module.exports = router;