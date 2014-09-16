/**
 * Created by abc on 15/9/14.
 */
'use strict';

var express = require('express');
var controller = require('./admin.controller');

var router = express.Router();

//router.get('/', controller.index);
router.post('/', controller.insertData);
router.post('/login', controller.loginDetail);
router.post('/category', controller.addCategory);
router.put('/category/:id', controller.updateCategory);
router.put('/category/deactive/:id',controller.deactiveCategory);

module.exports = router;