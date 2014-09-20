var mysql= require("mysql");

var connectionPool=mysql.createPool({
    host:'localhost',
    user: 'root',
    password :'123456',
    database:'db_shopping'
});

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
                connection.query('SELECT admin_id , user,pass FROM admin WHERE user = ? and pass = ? ',[username,password],function(err,result){
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
