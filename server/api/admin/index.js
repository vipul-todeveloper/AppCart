/**
 * Created by abc on 15/9/14.
 */
'use strict';

var express = require('express');

var controller= require('./admin.controller');
var router = express.Router();

router.post('/', controller.insertData);
router.post('/login', controller.loginDetail);
router.post('/category', controller.addCategory);
router.post('/logout', controller.logout);
router.put('/updatecategory/:id', controller.updateCategory);
router.put('/categoryStatus/:id', controller.categoryStatus);
router.post('/product', controller.addProduct);
router.put('/updateproduct/:id', controller.updateProduct);
router.put('/productStatus/:id', controller.productStatus);
router.get('/showcategory', controller.showCategory);
router.get('/showoncategory', controller.fnDataShowOnCategory)
module.exports = router;