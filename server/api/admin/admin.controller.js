/**
 * Created by abc on 15/9/14.
 */
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var mysql = require("mysql");
var btoa = require('btoa');



var connectionPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'db_shopping'
});

var manageSession = function (callback, req, res) {
    var token = req.body.token;
    console.log("Manage Session.....");

    connectionPool.getConnection(function (err, connection) {
        if (err) {
            console.log('Connection error:', err);
        }
        else {
            console.log("Else part of Manage Session");
            connection.query('SELECT temp_id,period from temp WHERE token = ?', [token], function (err, result) {
                console.log("JSON " + JSON.stringify(result));

                console.log(JSON.stringify(token));
                if (err) {
                    console.log('Connection error :', err);
                }
                else {
                    console.log("Successful");
                    var sessionStartTime = result[0].period;
                    console.log("Session Start Time:==> " + sessionStartTime);
                    var a = sessionStartTime.split(':'); // split it at the colons
                    var sessionStart = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                    console.log("Session START:==>" + sessionStart);

                    var d = new Date();
                    var sessionEndTime = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                    console.log("Session End Time" + sessionEndTime);

                    var b = sessionEndTime.split(':');
                    var sessionEnd = (+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2]);
                    console.log("Session End:==>" + sessionEnd);

                    var duration = sessionEnd - sessionStart;
                    console.log("Duration :==>" + duration);
                    if (duration >= 3600) {
                        console.log("Session Dead......");

                        connection.query('DELETE FROM temp WHERE temp_id =?', [result[0].temp_id], function (err, result) {
                            if (err) {
                                console.log('Connection error :', err);
                            }
                            else {
                                console.log("Session Delete From temp table ");
                                //process.exit(0);
                                res.send({
                                    'IsSuccess': true, 'msg': 'Session Dead'

                                });
                                process.exit(0);
                            }
                        });
                    }
                    else if (duration < 3600) {
                        console.log("Session Alive......");
                        connection.query('UPDATE temp SET period= ? WHERE temp_id=?', [sessionEndTime, result[0].temp_id], function (err, result) {
                            if (err) {
                                console.log('Connection error :', err);
                                console.log('Connection error :', err);

                            }
                            else {
                                console.log("Session Update From temp table ");
                                console.log("calling add category ::: ");
                                callback(req, res);
                            }
                        });
                    }

                }
            });
        }
    });
};
(function() {
    Date.prototype.toYMD = Date_toYMD;
    function Date_toYMD() {
        var year, month, day;
        year = String(this.getFullYear());
        month = String(this.getMonth() + 1);
        if (month.length == 1) {
            month = "0" + month;
        }
        day = String(this.getDate());
        if (day.length == 1) {
            day = "0" + day;
        }
        return year + "-" + month + "-" + day;
    }
})();

exports.loginDetail = function (req, res) {
    console.log("Login Detail.....");
    console.log(req.body);
    console.log("user :==>" + req.body.user);
    console.log("pass:==>" + req.body.pass);

    var username = req.body.user;
    var password = req.body.pass;
    var url = req.url;
    console.log("URL:=>" + url);

    console.log("Username :" + username);
    console.log("Password :" + password);
    connectionPool.getConnection(function (err, connection) {

        if (err) {
            console.log('Connection error:', err);
            res.statusCode = 503;
            res.send({
                'IsSuccess': false, 'msg': err, 'desc': 'Connection Error' + err
            });
        }
        else {
           if(username != "" && password != "")
           {
               connection.query('SELECT admin_id,user,pass FROM admin WHERE user= ? and pass = ?',[username,password],function(err,result){
                   if(err)
                   {
                       console.log('Connection error:', err);
                       res.send({
                           'IsSuccess': false, 'msg': err, 'desc': 'Connection Error' + err
                       });
                   }
                   else
                   {
                       var admin_id=result[0].admin_id;
                       console.log("admin_id:==>"+admin_id);
                       connection.query('SELECT token FROM temp WHERE user_id= ?',[admin_id],function(err,result){
                           if(err)
                           {
                               console.log('Connection error:', err);
                               res.send({
                                   'IsSuccess': false, 'msg': err, 'desc': 'Connection Error' + err
                               });

                           }
                           else{
                               console.log("Token:==>"+JSON.stringify(result));
                               console.log("Token Check is the the testing portion");
                              if(result[0] && result[0].token && result[0].token != null)
                              {
                                  console.log('Already Existing Token found');
                                  res.send({
                                      'IsSuccess': true, 'token':result[0].token , 'msg': 'Already Existing Token found'
                                  });
                              }
                               else
                              {


                                  var d = new Date();
                                  var ms = Date.parse(d);
                                  var apiToken= btoa(username+ms);
                                  console.log("API Token:==>"+apiToken);
                                  var period = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                                  console.log("Period" + period);

                                  connection.query('INSERT INTO temp (user_id,token,period) VALUES (?,?,?)',[admin_id,apiToken,period],function(err,result){
                                     if(err)
                                     {
                                         console.log('Connection error :', err);
                                         res.send({
                                             'IsSuccess': false, 'msg': err, desc: 'Database Error :==>' + err
                                         });
                                     }
                                     else{
                                         console.log(' Token created');
                                         res.send({
                                             'IsSuccess': true, 'token':apiToken, 'msg': 'Inserted successfully'
                                         });
                                     }

                                  });
                              }
                           }
                       });

                   }
               });
           }
           else
           {
               res.send({
                   'IsSuccess': false, 'msg': 'Not Successful Login.....', 'desc': 'Please enter username and password'
               });
           }
        }
        connection.release();
    });
};

exports.insertData = function (req, res) {
    console.log("Admin Insert");
    console.log("hi");
    console.log(req.query);
    console.log(req.body);
    console.log("bye");
    var obj = req.body;

    connectionPool.getConnection(function (err, connection) {
        if (err) {
            console.log('Connection error:', err);
            res.statusCode = 503;
            res.send({
                'IsSuccess': false, 'msg': err, 'desc': 'Connection Error' + err
            });
        }
        else {
            connection.query('INSERT INTO admin (firstname,user,pass,email) values (?,?,?,?)', [obj.firstname, obj.user, obj.pass, obj.email], function (err, result) {
                if (err) {
                    console.log('Connection error :', err);
                    res.statusCode = 500;
                    res.send({
                        'IsSuccess': false, 'msg': err, desc: 'Database Error :==>' + err
                    });
                }
                else {
                    console.log('Sucesssfull Inserted');
                    res.send({
                        'IsSuccess': true, 'data': [], 'msg': 'Inserted successfully'
                    });
                }
                connection.release();

            });
        }
    });
};

exports.addCategory = function (req, res) {
    console.log("Add Category......");
    manageSession(fnDatabaseAddCategory, req, res);
    console.log("Database Add Category");
};

exports.updateCategory = function (req, res) {
    console.log("Update Category......");
    manageSession(fnDatabaseUpdateCategory, req, res);
    console.log("Database Update Category");
};

exports.categoryStatus = function (req, res) {
    console.log("Status Category......");
    manageSession(fnDatabaseCategoryStatus, req, res);
    console.log("Database Status Category");
};
exports.logout = function (req, res) {
    console.log("Logout....!!");
    var token = req.body.token;
    console.log("Token" + token);
    connectionPool.getConnection(function (err, connection) {
        if (err) {
            console.log('Connection error :', err);
            res.statusCode = 500;
            res.send({
                'IsSuccess': false, 'msg': err, desc: 'Database Error :==>' + err
            });

        }
        else {
            connection.query('SELECT temp_id from temp WHERE token =?', [token], function (err, result) {
                console.log("Result:=>" + JSON.stringify(result));
                if (err) {
                    console.log('Connection error :', err);
                    res.statusCode = 500;
                    res.send({
                        'IsSuccess': false, 'msg': err, desc: 'Database Error :==>' + err
                    });
                }
                else {
                    console.log('Logout');
                    connection.query('DELETE FROM temp WHERE temp_id=?', [result[0].temp_id], function (err, result) {
                        if (err) {
                            console.log('Connection error :', err);
                            res.statusCode = 500;
                            res.send({
                                'IsSuccess': false, 'msg': err, desc: 'Database Error :==>' + err
                            });
                        }
                        else {
                            res.send({
                                'IsSuccess': true, 'data': [], 'msg': 'Logout...'
                            });


                        }
                    });
                }
            });
        }
    });
};

exports.productStatus = function (req, res) {
    console.log("Status Category......");
    manageSession(fnDatabaseProductStatus, req, res);
    console.log("Database Status Category");
};
exports.addProduct = function (req, res) {
    console.log("Add Product......");
    manageSession(fnDatabaseAddProduct, req, res);
    console.log("Database product Category");
};

exports.updateProduct=function(req,res){
    console.log("Update Product......");
    manageSession(fnDatabaseUpdateProduct, req, res);
    console.log("Database Update Product");
};


var fnDatabaseUpdateCategory = function (req, res) {
    console.log("Update Category.....");
    var obj = req.body;
    console.log(req.body);
    var paramsData = req.params.id;
    console.log(req.body.token);
    console.log(paramsData);


    connectionPool.getConnection(function (err, connection) {
        if (err) {
            console.log('Connection error:', err);
            res.statusCode = 503;
            res.send({
                'IsSuccess': false, 'msg': err, 'desc': 'Connection Error' + err
            });
        }
        else {

            connection.query('UPDATE category SET  cat_name =?,createdby = ?, createdate = ? WHERE cat_id= ?', [obj.cat_name, obj.createdby, obj.createdate, req.params.id], function (err, result) {
                console.log(JSON.stringify(result));
                if (err) {
                    console.log('Connection error :', err);
                    res.statusCode = 500;
                    res.send({
                        'IsSuccess': false, 'msg': err, desc: 'Database Error :==>' + err
                    });
                }
                else {
                    console.log('Successfully Updated');
                    res.send({
                        'IsSuccess': true, 'data': [], 'msg': 'Successfully Updated'
                    });
                }
                connection.release();
            });
        }
    });

};

var fnDatabaseCategoryStatus = function (req, res) {
    console.log("Deactivate Category.....");
    console.log("Parameter:==>" + req.params.id);
    var deactivate = 0;
    var activate = 1;

    connectionPool.getConnection(function (err, connection) {
        if (err) {
            console.log('Connection error:', err);
            res.statusCode = 503;
            res.send({
                'IsSuccess': false, 'msg': err, 'desc': 'Connection Error' + err
            });
        }
        else {
            connection.query('SELECT flag FROM category WHERE cat_id=?', [req.params.id], function (err, result) {
                console.log("Status:==>" + JSON.stringify(result));
                console.log("FLAG::=>" + result[0].flag[0]);
                if (result != 0) {
                    console.log('Some Data found');
                    if (result[0].flag[0] == 1) {
                        connection.query('UPDATE category SET flag =? WHERE cat_id=?', [deactivate, req.params.id], function (err, result) {
                            if (err) {
                                console.log('Connection error :', err);
                                res.statusCode = 500;
                                res.send({
                                    'IsSuccess': false, 'msg': err, desc: 'Database Error :==>' + err
                                });
                            }
                            else {
                                console.log('Deactivate....!!!');
                                res.send({
                                    'IsSuccess': true, 'data': [], 'msg': 'Category Deactivate'
                                });
                            }

                        });

                    }
                    else {
                        connection.query('UPDATE category SET flag =? WHERE cat_id=?', [activate, req.params.id], function (err, result) {
                            if (err) {
                                console.log('Connection error :', err);
                                res.statusCode = 500;
                                res.send({
                                    'IsSuccess': false, 'msg': err, desc: 'Database Error :==>' + err
                                });
                            }
                            else {
                                console.log('Activate....!!!');
                                res.send({
                                    'IsSuccess': true, 'data': [], 'msg': 'Category Activate'
                                });
                            }
                        });
                    }
                }

            });
        }


    });

};

var fnDatabaseAddProduct=function(req,res){
     var obj=req.body;
    console.log("Add Product"+JSON.stringify(obj));
    console.log("Add Product"+req.body.pro_name);
   console.log("Add Product :==>"+req.body.pro_desc);
    console.log("Add Product :==>"+req.body.discount);
    console.log("Add Product :==>"+req.body.pro_image);
    console.log("Add Product :==>"+req.body.pro_price);


   console.log("Add Product"+JSON.stringify(obj));

   connectionPool.getConnection(function(err,connection){
       if(err)
       {
           console.log('Connection error:', err);
           res.statusCode = 503;
           res.send({
               'IsSuccess': false, 'msg': err, 'desc': 'Connection Error' + err
           });
       }
       else {
           connection.query('SELECT user_id FROM temp WHERE token= ?', [req.body.token], function (err, result) {


               var dt = new Date();
               var str = dt.toYMD();

               console.log(result[0].user_id);
               if (err) {
                   console.log('Connection error :', err);
               }
               else {
                   //  console.log('find User Id from here');
                   connection.query('INSERT INTO product (pro_name,pro_desc,pro_image,pro_price,discount,createdt,createdby,flag,cat_id) VALUES (?,?,?,?,?,?,?,?,?)',[obj.pro_name,obj.pro_desc,obj.pro_image,obj.pro_price,obj.discount,str,result[0].user_id,obj.flag,obj.cat_id],function(err,result){
                       if(err)
                       {
                           console.log('Connection error :', err);
                           res.statusCode = 500;
                           res.send({
                               'IsSuccess': false, 'msg': err, desc: 'Database Error :==>' + err
                           });

                       }
                       else{

                           console.log('Successfully Inserted');
                           res.send({
                               'IsSuccess': true, 'data': [], 'msg': 'Inserted successfully'
                           });
                       }
                       connection.release();
                   });
               }
           });

       }
        console.log("INSERT DATA...");
   });
};

var fnDatabaseUpdateProduct=function(req,res){
  console.log("Fn Database Update Product.......");
    var obj=req.body;
    console.log("OBJ:==>"+JSON.stringify(obj));
    console.log("Params:=>"+req.params.id);

    console.log("UPDATE Product"+req.body.pro_name);
    console.log("Update Product :==>"+req.body.pro_desc);
    console.log("Update Product :==>"+req.body.discount);
    console.log("Update Product :==>"+req.body.pro_image);
    console.log("Update Product :==>"+req.body.pro_price);
    connectionPool.getConnection(function(err,connection){
      if(err)
      {
          console.log('Connection error:', err);
          res.statusCode = 503;
          res.send({
              'IsSuccess': false, 'msg': err, 'desc': 'Connection Error' + err
          });
      }
      else
      {
           var strQuery = "UPDATE product SET pro_name="+ obj.pro_name +",pro_desc="+obj.pro_desc+",pro_image="+obj.pro_image+",pro_price="+obj.pro_price+",discount="+obj.discount+",createdt="+obj.createdt+",createdby="+obj.createdby+",flag="+obj.flag+",cat_id="+obj.cat_id+" WHERE pro_id="+req.params.id+" ";
           console.log("strQuery:==>"+strQuery);

          connection.query('UPDATE product SET pro_name=?,pro_desc=?,pro_image=?,pro_price=?,discount=?,createdt=?,createdby=?,flag=?,cat_id=? WHERE pro_id=?',[obj.pro_name,obj.pro_desc,obj.pro_image,obj.pro_price,obj.discount,obj.createdt,obj.createdby,obj.flag,obj.cat_id,req.params.id],function(err,result){

          console.log("Query Success");
               if (err) {
                   console.log('Connection error :', err);
                   res.statusCode = 500;
                   res.send({
                       'IsSuccess': false, 'msg': err, desc: 'Database Error :==>' + err
                   });
               }
               else {
                   console.log('Successfully Updated');
                   res.send({
                       'IsSuccess': true, 'data': [], 'msg': 'Successfully Updated'
                   });
               }

           });
      }
    });
};
var fnDatabaseAddCategory = function (req, res) {
    var obj = req.body;
    var checkToken = req.body.token;
    console.log("inside add category");
    connectionPool.getConnection(function (err, connection) {
        if (err) {
            console.log('Connection error:', err);
            res.statusCode = 503;
            res.send({
                'IsSuccess': false, 'msg': err, 'desc': 'Connection Error' + err
            });
        }
        else {
            connection.query('SELECT user_id FROM temp WHERE token= ?',[req.body.token],function(err,result){


                console.log(result[0].user_id);
                if (err) {
                    console.log('Connection error :', err);
                }
                else {

                    var dt = new Date();
                    var str = dt.toYMD();

                    connection.query('INSERT INTO category (cat_name,createdby,createdate,flag) values (?,?,?,?)', [obj.cat_name, result[0].user_id,str, obj.flag], function (err, result) {
                        console.log(JSON.stringify(result));
                        if (err) {
                            console.log('Connection error :', err);
                            res.statusCode = 500;
                            res.send({
                                'IsSuccess': false, 'msg': err, desc: 'Database Error :==>' + err
                            });
                        }
                        else {
                            console.log('Successfully Inserted');
                            res.send({
                                'IsSuccess': true, 'data': [], 'msg': 'Inserted successfully'
                            });
                        }
                        connection.release();
                    });
                }
            });

        }
    });
};

var fnDatabaseProductStatus = function (req, res) {
    console.log("Deactivate Category.....");
    console.log("Parameter:==>" + req.params.id);
    var deactivate = 0;
    var activate = 1;

    connectionPool.getConnection(function (err, connection) {
        if (err) {
            console.log('Connection error:', err);
            res.statusCode = 503;
            res.send({
                'IsSuccess': false, 'msg': err, 'desc': 'Connection Error' + err
            });
        }
        else {
            connection.query('SELECT flag FROM product WHERE pro_id=?', [req.params.id], function (err, result) {
                console.log("Status:==>" + JSON.stringify(result));
                console.log("FLAG::=>" + result[0].flag[0]);
                if (result != 0) {
                    console.log('Some Data found');
                    if (result[0].flag[0] == 1) {
                        connection.query('UPDATE product SET flag =? WHERE pro_id=?', [deactivate, req.params.id], function (err, result) {
                            if (err) {
                                console.log('Connection error :', err);
                                res.statusCode = 500;
                                res.send({
                                    'IsSuccess': false, 'msg': err, desc: 'Database Error :==>' + err
                                });
                            }
                            else {
                                console.log('Deactivate....!!!');
                                res.send({
                                    'IsSuccess': true, 'data': [], 'msg': 'Product Deactivate'
                                });
                            }

                        });

                    }
                    else {
                        connection.query('UPDATE product SET flag =? WHERE pro_id=?', [activate, req.params.id], function (err, result) {
                            if (err) {
                                console.log('Connection error :', err);
                                res.statusCode = 500;
                                res.send({
                                    'IsSuccess': false, 'msg': err, desc: 'Database Error :==>' + err
                                });
                            }
                            else {
                                console.log('Activate....!!!');
                                res.send({
                                    'IsSuccess': true, 'data': [], 'msg': 'Product Activate'
                                });
                            }
                        });
                    }
                }
            });
        }
    });
};