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
var mysql= require("mysql");
var btoa = require('btoa');

var dao=require('./admin.dao');

var connectionPool=mysql.createPool({
    host:'localhost',
    user: 'root',
    password :'123456',
    database:'db_shopping'
});

var manageSession=function(callback,req,res)
{
    var token = req.body.token;
    console.log("Manage Session.....");

    connectionPool.getConnection(function(err,connection){
        if(err)
        {
            console.log('Connection error:',err);
        }
        else
        {
            console.log("Else part of Manage Session");
            connection.query('SELECT temp_id,period from temp WHERE token = ?',[token],function(err,result){
                console.log("JSON "+JSON.stringify(result));

                console.log(JSON.stringify(token));
                if(err)
                {
                    console.log('Connection error :',err);
                }
                else
                {
                    console.log("Successful");
                    var sessionStartTime = result[0].period;
                    console.log("Session Start Time:==> "+sessionStartTime);
                    var a = sessionStartTime.split(':'); // split it at the colons
                    var sessionStart = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                    console.log("Session START:==>"+sessionStart);

                    var d= new Date();
                    var sessionEndTime = d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds();
                    console.log("Session End Time"+sessionEndTime);

                    var b=sessionEndTime.split(':');
                    var sessionEnd = (+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2]);
                    console.log("Session End:==>"+sessionEnd);

                    var duration=sessionEnd-sessionStart;
                    console.log("Duration :==>"+duration);
                    if(duration>=3600)
                    {
                        console.log("Session Dead......");

                        connection.query('DELETE FROM temp WHERE temp_id =?',[result[0].temp_id],function(err,result){
                            if(err)
                            {
                                console.log('Connection error :',err);
                            }
                            else
                            {
                                console.log("Session Delete From temp table ");
                                process.exit(0);
                                res.send({
                                        'IsSuccess' : true, 'msg':'Session Dead'

                                });
                            }
                        });
                    }
                    else if(duration<3600)
                    {
                        console.log("Session Alive......");
                        connection.query('UPDATE temp SET period= ? WHERE temp_id=?',[sessionEndTime,result[0].temp_id],function(err,result){
                            if(err)
                            {
                                console.log('Connection error :',err); console.log('Connection error :',err);

                            }
                            else
                            {
                                console.log("Session Update From temp table ");
                                console.log("calling add category ::: ");
                                callback(req,res);
                            }
                        });
                    }

                }
            });
        }
    });
};


exports.loginDetail=function(req,res){
    console.log("Login Detail.....");
    console.log(req.body);
    console.log("user :==>" +req.body.user);
    console.log("pass:==>" +req.body.pass);

    var username=req.body.user;
    var password=req.body.pass;
    var url= req.url;
    console.log("URL:=>"+url);

    console.log("Username :"+username);
    console.log("Password :"+password);
    connectionPool.getConnection(function(err,connection){

        if(err)
        {
            console.log('Connection error:',err);
            res.statusCode=503;
            res.send({
                'IsSuccess' : false, 'msg': err ,'desc':'Connection Error'+err
            });
        }
        else
        {
            if(username != "" && password !== "")
            {
                connection.query('SELECT admin_id, user,pass FROM admin WHERE user = ? and pass = ? ',[username,password],function(err,result){
                    var id=result[0].admin_id;
                    var token=result[0].user;
                    console.log("Token:==>"+token);

                    var apiToken=btoa(token);
                    console.log("API Token:==>"+apiToken);
                    var d=new Date();
                    var ms= Date.parse(d);
                    console.log("API Token:==>"+(apiToken+ms));
                    var period= d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds();
                    console.log("Period"+period);

                    if(err)
                    {
                        console.log('Connection error :',err);
                        res.statusCode=500;
                        res.send({
                            'IsSuccess' : false, 'msg': err , desc:'Database Error :==>'+err
                        });
                    }
                    else
                    {
                        console.log("Result:==>"+result.length);
                        if(result.length != 0)
                        {
                            console.log(' Login Successfully');

                            connection.query('INSERT INTO temp (user_id,token,period) VALUES (?,?,?)',[id,(apiToken+ms),period],function(err,result){
                                if(err)
                                {
                                    res.send({
                                        'IsSuccess' : false, 'msg': err , desc:'Database Error :==>'+err
                                    });
                                }
                                else
                                {
                                    res.send({
                                        'IsSuccess' : true, 'token': (apiToken+ms) ,'msg':' Login Successful....'
                                    });

                                }
                            });

                        }
                        else
                        {
                            console.log("Not Successful Login.....");
                            res.send({
                                'IsSuccess' : false, 'msg': 'Login Not Successful' , desc:'Please Check Username or  Password'
                            });
                        }
                    }
                });
            }
            else
            {
                res.send({
                    'IsSuccess': false, 'msg':'Login Unsuccessful' , 'desc': 'Username and Password Should not be empty'
                });
            }

        }
        connection.release();
    });
};


/*
 exports.index = function(req, res) {
 res.json([
 {
 name : 'Development Tools',
 info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
 }, {
 name : 'Server and Client integration',
 info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
 }, {
 name : 'Smart Build System',
 info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
 },  {
 name : 'Modular Structure',
 info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
 },  {
 name : 'Optimized Build',
 info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
 },{
 name : 'Deployment Ready',
 info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
 }
 ]);
 };
 */

/*

 * purpose : used to register admin
 * Call:POST
 * url:http://localhost:9000/api/admin
 * input parameters : {firstname : "admin",user="admin",pass="admin",email="admin@admin.com"}
 * output :
 > success:
 {IsSuccess:true,data:[],msg:""}
 > Error :
 {IsSuccess:false,msg:"",desc:""}

 */
/*
 exports.insertData=function(req,res)
 {
 console.log("Admin Insert");
 console.log("hi");
 console.log(req.query);
 console.log(req.body);
 console.log("bye");
 var obj = req.body;

 connectionPool.getConnection(function(err,connection){
 if(err){
 console.log('Connection error:',err);
 res.statusCode=503;
 res.send({
 'IsSuccess' : false, 'msg': err ,'desc':'Connection Error'+err
 });
 }
 else
 {
 connection.query('INSERT INTO admin (firstname,user,pass,email) values (?,?,?,?)',[obj.firstname,obj.user,obj.pass,obj.email],function(err,result){
 if(err)
 {
 console.log('Connection error :',err);
 res.statusCode=500;
 res.send({
 'IsSuccess' : false, 'msg': err , desc:'Database Error :==>'+err
 });
 }
 else
 {
 console.log('Sucesssfull Inserted');
 res.send({
 'IsSuccess' : true, 'data': [] ,'msg':'Inserted successfully'
 });
 }
 connection.release();

 });
 }
 });
 };
 */

/*
 * purpose : To check admin login successful or not
 * Call:POST
 * url : http://localhost:9000/api/admin/login
 * input parameters : {user="admin1",pass="admin1"}
 * output :
 > success:
 {IsSuccess:true,data:[{user="admin1",pass="admin1"}],msg:"Login Successful"}
 > Error :
 {IsSuccess:false,msg:"Not successful Login",desc:"Please Check username or password"}
 > Error :
 {IsSuccess:false,msg:"Not successful Login",desc:"Username and Password can not be empty.."}
 */


/*

 * purpose : To add category by admin
 * Call:POST
 * url:http://localhost:9000/api/admin/category
 * input parameters : {cat_name : "Toys",createdate="2014-04-15",createdby="Rohit",Flag:"0" or "1"}("0" For Deactive or "1" for Active)
 * output :
 > success:
 {IsSuccess:true,data:[],msg:""}
 > Error :
 {IsSuccess:false,msg:"",desc:""}

 */

exports.addCategory=function(req,res)

{
    console.log("Add Category......");
    manageSession(fnDatabaseAddCategory,req,res);

    console.log("Check ");
};


var fnDatabaseAddCategory= function (req,res){
    var obj = req.body;
    var checkToken = req.body.token;
    console.log("inside add category");
    connectionPool.getConnection(function(err,connection){
        if(err){
            console.log('Connection error:',err);
            res.statusCode=503;
            res.send({
                'IsSuccess' : false, 'msg': err ,'desc':'Connection Error'+err
            });
        }
        else
        {
            connection.query('INSERT INTO category (cat_name,createdby,createdate,flag) values (?,?,?,?)',[obj.cat_name,obj.createdby,obj.createdate,obj.flag],function(err,result){
                console.log(JSON.stringify(result));
                if(err)
                {
                    console.log('Connection error :',err);
                    res.statusCode=500;
                    res.send({
                        'IsSuccess' : false, 'msg': err , desc:'Database Error :==>'+err
                    });
                }
                else
                {
                    console.log('Successfully Inserted');
                    res.send({
                        'IsSuccess' : true, 'data': [] ,'msg':'Inserted successfully'
                    });
                }
                connection.release();
            });
        }
    });
};

exports.logout=function(req,res){
  console.log("Logout....!!");
  var token= req.body.token;
  console.log("Token"+token);
  connectionPool.getConnection(function(err,connection){
      if(err)
      {
          console.log('Connection error :',err);
          res.statusCode=500;
          res.send({
              'IsSuccess' : false, 'msg': err , desc:'Database Error :==>'+err
          });

      }
      else
      {
          connection.query('SELECT temp_id from temp WHERE token =?',[token],function(err,result){
              console.log("Result:=>"+JSON.stringify(result));
              if(err)
              {
                  console.log('Connection error :',err);
                  res.statusCode=500;
                  res.send({
                      'IsSuccess' : false, 'msg': err , desc:'Database Error :==>'+err
                  });
              }
              else{
                  console.log('Logout');
                  connection.query('DELETE FROM temp WHERE temp_id=?',[result[0].temp_id],function(err,result){
                      if(err)
                      {
                          console.log('Connection error :',err);
                          res.statusCode=500;
                          res.send({
                              'IsSuccess' : false, 'msg': err , desc:'Database Error :==>'+err
                          });
                      }
                      else
                      {
                          res.send({
                              'IsSuccess' : true, 'data':[] ,'msg':'Logout...'
                          });
                          process.exit(0);

                      }
                  });
                 }
          });
      }
  });
};


/*exports.updateCategory=function(req,res){
 console.log("Update Category.....");
 var obj = req.body;
 console.log(req.body);
 var paramsData=req.params.id;
 console.log(paramsData);


 connectionPool.getConnection(function(err,connection){
 if(err){
 console.log('Connection error:',err);
 res.statusCode=503;
 res.send({
 'IsSuccess' : false, 'msg': err ,'desc':'Connection Error'+err
 });
 }
 else
 {
 connection.query('UPDATE category SET  cat_name =?,createdby = ?, createdate = ? WHERE cat_id= ?',[obj.cat_name,obj.createdby,obj.createdate,req.params.id],function(err,result){
 console.log(JSON.stringify(result));
 if(err)
 {
 console.log('Connection error :',err);
 res.statusCode=500;
 res.send({
 'IsSuccess' : false, 'msg': err , desc:'Database Error :==>'+err
 });
 }
 else
 {
 console.log('Successfully Updated');
 res.send({
 'IsSuccess' : true, 'data': [] ,'msg':'Successfully Updated'
 });
 }
 connection.release();
 });
 }
 });

 };*/

/*exports.deactiveCategory=function(req,res){
 console.log("Deactivate Category.....");



 var paramsData=req.params.id;
 console.log(paramsData);

 connectionPool.getConnection(function(err,connection){
 if(err)
 {
 console.log('Connection error:',err);
 res.statusCode=503;
 res.send({
 'IsSuccess' : false, 'msg': err ,'desc':'Connection Error'+err
 });
 }
 else
 {
 connection.query('SELECT flag FROM category WHERE cat_id= ? ',paramsData,function(err,result){
 if(err)
 {
 console.log('Connection error :',err);
 res.statusCode=500;
 res.send({
 'IsSuccess' : false, 'msg': err , desc:'Database Error :==>'+err
 });
 }
 else
 {
 console.log("Result:==>"+result.length);
 console.log(JSON.stringify(result));


 if(result.length != 0)
 {
 console.log('Some Data found');
 res.send({
 'IsSuccess' : true, 'data': result ,'msg':'Some Data Found....'
 });
 }
 else
 {
 console.log("Not Data Found.....");
 res.send({
 'IsSuccess' : false, 'msg': 'Not Data Found.....' , desc:'Not Data Found.....'
 });
 }
 }
 });
 }
 });
 };*/


