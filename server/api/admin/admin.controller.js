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

var connectionPool=mysql.createPool({
    host:'localhost',
    user: 'root',
    password :'123456',
    database:'db_shopping'
});
// Get list of things
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
exports.insertData=function(req,res)
{
    console.log("Admin Insert");
    console.log("hi");
    console.log(req.query);
    console.log(req.body);
//console.log(req);
    console.log("bye");
    var obj = req.body;

//console.log(objuser.firstname);
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

exports.loginDetail=function(req,res){

  console.log("Login Detail.....");
    console.log(req.body);
    console.log("user :==>" +req.body.user);
    console.log("pass:==>" +req.body.pass);

    var username=req.body.user;
    var password=req.body.pass;

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
             connection.query('SELECT user,pass FROM admin WHERE user = ? and pass = ? ',[username,password],function(err,result){
                 console.log("Result :==>"+result);

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
                         res.send({
                             'IsSuccess' : true, 'data': result ,'msg':' Login Successful....'
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

exports.updateCategory=function(req,res){
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

};

exports.deactiveCategory=function(req,res){
    console.log("Deactivate Category.....");
    var deactive = 0;
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
            connection.query('UPDATE category SET flag=?  WHERE cat_id= ?',[deactive,req.params.id],function(err,result){
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
                    console.log('Successfully Deactivate');
                    res.send({
                        'IsSuccess' : true, 'data': [] ,'msg':'Successfully Deactivate'
                    });
                }
                connection.release();

            });
        }
    });

};