/**
 * Created by abc on 15/9/14.
 */
'use strict';

var express = require('express');
var controller = require('./admin.controller');

var router = express.Router();

//router.get('/', controller.index);
router.post('/', controller.insertData);
router.get('/', controller.LoginDetail);


module.exports = router;