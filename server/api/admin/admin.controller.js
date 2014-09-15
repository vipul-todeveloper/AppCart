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

exports.insertData=function(req,res)
{
    console.log("Admin Insert");
    console.log("hi");
    console.log(req.query);
    console.log(req.body);
//console.log(req);
    console.log("bye");
    var objuser = req.body;

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
            connection.query('INSERT INTO admin (firstname,user,pass,email) values (?,?,?,?)',[objuser.firstname,objuser.user,objuser.pass,objuser.email],function(err,result){
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


}


