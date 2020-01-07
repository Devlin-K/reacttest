
var moment = require('moment');
var express=require('express');

var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://127.0.0.1:27017/reactf1';
var bodyParser = require('body-parser');
var session = require("express-session");
const path = require('path')
var app =  new express();
var multer  = require('multer')

var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'jpg/api')
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+Date.now()+'.jpg')
    }
})
var upload = multer({storage:storage})




app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    secret:"ff",
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*30
    },
    rolling:true
}))

app.use(express.static("/jpg"));
app.use(express.static("jpg"));
app.use(express.static(path.join(__dirname, 'jpg')));





function todoupdate (MongoClient,dburl,collectionname,searchobj,updateobj,searchcallback,noresultcallback){
    MongoClient.connect(dburl,function(err,db){
        if(err){return}
        db.collection(collectionname).updateOne(searchobj,{$set:updateobj},function(err,data){
            if(err){db.close();noresultcallback(err)}
            if(data){
                db.close();
                searchcallback(data);        
            }else{
                db.close();
                noresultcallback(data);
            }
        })
    })
}
function todosearch (MongoClient,dburl,collectionname,searchobj,searchcallback,noresultcallback){
    MongoClient.connect(dburl,function(err,db){
        if(err){return}
        db.collection(collectionname).find(searchobj).toArray(function(err,data){
            if(err){db.close();noresultcallback(err)}
            if(data.length>0){
                db.close();
                searchcallback(data);        
            }else{
                db.close();
                noresultcallback(data);
            }
        })
    })
}
function todosearchmany (MongoClient,dburl,collectionname,searchobj,searchcallback,noresultcallback){
    MongoClient.connect(dburl,function(err,db){
        if(err){return}
        db.collection(collectionname).find(searchobj).toArray(function(err,data){
            if(err){db.close();noresultcallback(err)}
            if(data){
                db.close();
                searchcallback(data);        
            }else{
                db.close();
                noresultcallback(data);
            }
        })
    })
}
function todoinsert(MongoClient,dburl,collectionname,insertobjarray,callback,failcallback){
    MongoClient.connect(dburl,function(err,db){
        if(err){db.close();return}
        let collection=db.collection(collectionname);
        collection.insertMany(insertobjarray,function(err,res){
            if(err){db.close();failcallback(err)}
            db.close();
            callback(res);
        })
    })
}
function todoget(MongoClient,dburl,collectionname,searchobj,searchcallback,noresultcallback) { 
    MongoClient.connect(dburl,function(err,db){
        if(err){db.close();return}
        let collection=db.collection(collectionname);
        collection.find(searchobj).toArray(function(err,data){
            if(err){db.close();noresultcallback(err)}
            if(data.length>0){
                db.close();
                searchcallback(data);        
            }else{
                db.close();
                noresultcallback(data);
            }
        })
    })
}
function tododelid(MongoClient,dburl,collectionname,searchobj,searchcallback,noresultcallback) { 
    MongoClient.connect(dburl,function(err,db){
        if(err){db.close();return}
        let collection=db.collection(collectionname);
        collection.findAndRemove(searchobj,function(err,data){
            if(err){db.close();noresultcallback(err)}
            searchcallback(data);        
        })
    })
}
// //设置允许跨域访问该服务.
// // 自定义跨域中间件
var allowCors = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
  };
app.use(allowCors);//使用跨域中间件

app.get('/api',(req,res)=>{
    res.send('lllll')
})

app.post('/api/dologin',(req,res)=>{
    console.log(req.body);
    let username=req.body.username;
    let password=req.body.password;
    let searchobj={username,password}
    let searchcallback=function(){
        return res.send("success");
    }
    let noresultcallback=function () {
        return res.send("failed");
    }
    todosearch(MongoClient,dburl,'user',searchobj,searchcallback,noresultcallback);   
})

app.post('/api/doregist',(req,res)=>{
    console.log(req.body);
    let nickname=req.body.nickname;
    let username=req.body.username;
    let password=req.body.password;
    let headurl = '/api/headjpg/head1.jpg';
    let articlecollect=[];
    let constructdate= moment().format('YYYY-MM-DD');
    let callback=function(data){
        return res.send("success")
    }
    let failcallback=function(err){
        return res.send("failed");
    }   
    let searchobj = {'username':username};
    let insertobjarray=[{'username':username,'password':password,'nickname':nickname,'headurl':headurl,'articlecollect':articlecollect,'constructdate':constructdate}];
    let searchcallback=function(){
        return res.send("userduplicate");
    }
    let noresultcallback =function () {
        todoinsert(MongoClient,dburl,'user',insertobjarray,callback,failcallback);
    }
    todosearch(MongoClient,dburl,'user',searchobj,searchcallback,noresultcallback);
})

app.post('/api/validateuser',(req,res)=>{
    console.log(req.body);
    let username=req.body.username;
    let searchobj={'username':username};
    let searchcallback=function(){
        return res.send("duplicate");
    }
    let noresultcallback=function () {
        return res.send("pass");
    }
    todosearch(MongoClient,dburl,'user',searchobj,searchcallback,noresultcallback);
})
app.post('/api/checkuser',(req,res)=>{
    console.log(req.body);
    let username=req.body.username;
    let searchobj={'username':username};
    let searchcallback=function(data){
        let nickname=data[0].nickname;
        let headurl =data[0].headurl;
        let articlecollect=data[0].articlecollect;
        let sendobj={'nickname':nickname,'headurl':headurl,'articlecollect':articlecollect};
        return res.send(sendobj);
    }
    let noresultcallback=function () {
        return res.send("err");
    }
    todosearch(MongoClient,dburl,'user',searchobj,searchcallback,noresultcallback);
})

app.post('/api/delmessage',(req,res)=>{
    console.log(req.body);
    let searchdate=req.body.datetime;
    let searchobj={'constructdate':searchdate};
    let searchcallback=function(data){
        
        return res.send('success');
    }
    let noresultcallback=function () {
        return res.send("err");
    }
    tododelid(MongoClient,dburl,'message',searchobj,searchcallback,noresultcallback);
})
app.post('/api/delarticle',(req,res)=>{
    console.log(req.body);
    let searchdate=req.body.dateid;
    let searchobj={'dateid':searchdate};
    let searchcallback=function(data){
        return res.send('success');
    }
    let noresultcallback=function () {
        return res.send("err");
    }
    tododelid(MongoClient,dburl,'article',searchobj,searchcallback,noresultcallback);
})
app.post('/articledetail/api/delmessage',(req,res)=>{
    console.log(req.body);
    let ariticledate=req.body.dateid;
    let commentdate=req.body.datetime;
    let searchobj={'dateid':ariticledate};
    let searchcallback=function(data){
        return res.send('success');
    }
    let noresultcallback=function () {
        return res.send("err");
    }
    MongoClient.connect(dburl,function(err,db){
        if(err){return}
        db.collection('aricle').update(searchobj,{$pull:{'comment':{'constructdate' : commentdate}}},function(err,data){
            if(err){db.close();noresultcallback(err)}
            if(data){
                console.log(data);
                db.close();
                searchcallback(data);        
            }else{
                db.close();
                noresultcallback(data);
            }
        })
    })
})

// {
// "title":"xxx",
// "author":"xxx",
// "headurl":"xxx",
// "content":"xxx",
// "collect":"xx",
// "like":"xx",
// "costractdate":"xxx"
// "comment":[{"author":"xxx","comments":"xxx"},{"author":"xxx","comments":"xxx"}],
// }

app.post('/api/addarticle',(req,res)=>{
    console.log(req.body);
    let title=req.body.title;
    let author=req.body.author;
    let account =req.body.account;
    let headurl=req.body.headurl;
    let content=req.body.content;
    let like = req.body.like;
    let comment=req.body.comment;
    let constructdate=req.body.constructdate;
    let dateid = req.body.dateid;
    // constructdate=moment(constructdate);
    // console.log(constructdate);
    // setTimeout(() => {
    // let constructdate2=moment().format('YYYY-MM-DD hh:mm:ss.SSS');
    // let constructdate3=moment(constructdate2).diff(constructdate,"seconds");
    // console.log(constructdate3);
    // }, 1000);
    
    let insertMany=[{"title":title,"author":author,"account":account,"headurl":headurl,"content":content,"like":like,"comment":comment,'constructdate':constructdate,'dateid':dateid}];
    function callback(data) { 
        return res.send("success");
     }
    function failcallback(data){
        return res.send("fail");
    }

    todoinsert(MongoClient,dburl,'article',insertMany,callback,failcallback);
})

app.post('/api/getarticle',(req,res)=>{
    console.log(req.body);
    searchobj={};
    callback=function(data){
        res.send(data);
    }
    failcallback=function(data){
        res.send(data);
    }
    todoget(MongoClient,dburl,'article',searchobj,callback,failcallback)
})
app.post('/api/getarticledetail',(req,res)=>{
    console.log(req.body);
    searchobj={'dateid':req.body.dateid};
    callback=function(data){
        res.send(data);
    }
    failcallback=function(data){
        res.send(data);
    }
    todoget(MongoClient,dburl,'article',searchobj,callback,failcallback)
})
app.post('/api/getmessage',(req,res)=>{
    console.log(req.body);
    searchobj={};
    callback=function(data){
        res.send(data);
    }
    failcallback=function(data){
        res.send(data);
    }
    todoget(MongoClient,dburl,'message',searchobj,callback,failcallback)
})


app.post('/api/addmessage',(req,res)=>{
    console.log(req.body);
    let nickname =req.body.nickname;
    let user=req.body.user;
    let headurl=req.body.headurl;
    let content=req.body.content;
    let constructdate=req.body.datetime;
    let insertMany=[{"user":user,'nickname':nickname,"headurl":headurl,"content":content,'constructdate':constructdate}];
    function callback(data) { 
        return res.send("success");
     }
    function failcallback(data){
        return res.send("fail");
    }

    todoinsert(MongoClient,dburl,'message',insertMany,callback,failcallback);
})
app.post('/articledetail/api/addmessage',(req,res)=>{
    console.log(req.body);
    let nickname =req.body.nickname;
    let user=req.body.user;
    let headurl=req.body.headurl;
    let content=req.body.content;
    let constructdate=req.body.datetime;
    let searchobj={'dateid':req.body.id};
    let insertobj={"user":user,'nickname':nickname,"headurl":headurl,"content":content,'constructdate':constructdate};
    function callback(data) { 
        return res.send("success");
     }
    function failcallback(data){
        return res.send("fail");
    }
    function searchcallback(data){
        let origindata=data[0].comment;
        origindata.push(insertobj);
        let updateobj={'comment':origindata};
        todoupdate(MongoClient,dburl,'article',searchobj,updateobj,callback,failcallback);
    }
    todosearch(MongoClient,dburl,'article',searchobj,searchcallback)
})


app.post('/api/photos/upload', upload.single('file'), function (req, res, next) {

    console.log(req.file); 
    let data={"jpgurl":req.file.filename};
    return  res.send(data);
  })

app.post('/api/updatelike',(req,res)=>{
    let articlelist=req.body.articlelist;
    let sign=[];
    for(let i=0;i<articlelist.length;i++){
        let searchobj={'dateid':articlelist[i].dateid}
        let updateobj={'like':articlelist[i].like}
        searchcallback=(data)=>{
            sign.push(true);
        }
        noresultcallback=(data)=>{
            sign.push(false);
        }  
        todoupdate(MongoClient,dburl,'article',searchobj,updateobj,searchcallback,noresultcallback)
    }
    // judgestate = (sign,articlelist,callback)=>{
    //     if(sign.length===articlelist.length){
    //         callback(sign)
    //     }
    //     else{setTimeout(judgestate(sign,articlelist,callback), 5000)}
    // }
//nodejs发现递归不给运行，暂未想到解决方法，直接通过修改
    // resolves=(sign)=>{
    //     for(let i=0;i<sign.length;i++){
    //         if(i===false){
    //             return res.send('fail');
    //         }
    //     }
    //     return res.send('success');
    // }
    // judgestate(sign,articlelist,resolves);
    res.send('success');
})

app.post('/api/updatecollect',(req,res)=>{
    let user=req.body.user;
    let articlecollect=req.body.articlecollect
    let searchobj={'username':user}
    let updateobj={'articlecollect':articlecollect}
    searchcallback=(data)=>{
        res.send('success');
    }
    noresultcallback=(data)=>{
        res.send('fail');
    }  
    todoupdate(MongoClient,dburl,'user',searchobj,updateobj,searchcallback,noresultcallback)
})

app.post('/api/getcollectarticle',(req,res)=>{
    console.log(req.body);
    if(req.body!={}){
        let articlecollect=req.body.articlecollect;
        let searchobj={'dateid':{$in:articlecollect}};
        searchcallback=(data)=>{
            console.log(data,'yy')
            return    res.send(data);
        }
        noresultcallback=(data)=>{
            console.log(data,'xxx')
            return res.send('');
        }
    
    
        todosearchmany(MongoClient,dburl,'article',searchobj,searchcallback,noresultcallback)
    }
    else{
        return res.send('')
    }
})
app.post('/api/updateuser',(req,res)=>{
    console.log(req.body);
    let searchobj={'username':req.body.user}
    searchcallback=()=>{
        res.send('success');
    }
    noresultcallback=()=>{
        res.send('fail');
    }
    if(req.body.nickname){
        let updateobj={'nickname':req.body.nickname};
        todoupdate(MongoClient,dburl,'user',searchobj,updateobj,searchcallback,noresultcallback)
    }
    if(req.body.password){
        let updateobj={'password':req.body.password};
        todoupdate(MongoClient,dburl,'user',searchobj,updateobj,searchcallback,noresultcallback)
    }
    if(req.body.headurl){
        let updateobj={'headurl':req.body.headurl};
        todoupdate(MongoClient,dburl,'user',searchobj,updateobj,searchcallback,noresultcallback)
    }
})


app.listen(3002,'127.0.0.1');