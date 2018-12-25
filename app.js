const express = require('express');
// const mysql = require('mysql');
// 创建app应用 == Node.js 中的http.createServer();
const app = express();

// 链接mongooes数据库
const mongooes = require('mongoose');
const bodyParse = require('body-parser');

// 记载cookies模块
const Cookies = require('cookies');


// 模板的使用：后端逻辑和表现分离-前后端分离
// 加载模板
const swig = require('swig');
// 配置模板应用
// 定义当前应用所使用的模板引擎
// 第一个参数：模板引擎的名称，同时也是模板文件的后缀，第二个参数：表示用于解析处理文件模板内容的方法。
app.engine('html', swig.renderFile);

// 设置模板文件存放的目录,第一个参数必须是views，第二个参数是目录
app.set('views', './views')

// 注册所使用的模板引擎，第一个参数必须是 view engine，第二个参数和app.engine这个
// 方法中定义的模板引擎的名称（第一个参数）是一致的。
app.set('view engine', 'html');

swig.setDefaults({ cache: false }); // 在开发过程中，需要取消模板缓存。
app.use(bodyParse.urlencoded({ extended: true }));

// 使用express静态文件托管
// 当用户请求的文件的路径是以./public开始的，则调用后面的方式来进行处理（对 __dirname + '/public' 下的文件进行处理）,
app.use('/public', express.static(__dirname + '/public'));

// 设置cookie
app.use((req, res, next)=> { //  当用户访问时会走这里
  req.cookies = new Cookies(req, res); // 设置和获取cookie
  const cookie = req.cookies.get('userInfo');
  req.userInfo = {};
  if (cookie) {
    try {
      req.userInfo = JSON.parse(cookie); // 解析登录用户的cookie信息
    }catch (e) {
      console.log(e);
    }
  }
  
  next();
});


/*
* 用户发送http请求——> url ——> 解析路由 ——> 找到匹配的规则 ——> 执行指定的绑定函数，返回内容给用户。
*
* /public -> 静态 -> 直接指定目录下的文件给用户。
*
* 动态-> 处理业务咯，加载模块，解析模块，-> 返回数据给用户。
* */

// 分模块来进行开发，根据不同的功能，划分模块。
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

app.listen(8088, 'localhost');
// 链接数据库
/*
mongooes.connect('mongodb://localhost:27017/node-blog', (err)=> {
  if (!err){
    console.log('---链接成功---');
    // 监听http请求
    app.listen(8088, 'localhost');
  } else {
    console.log('---链接失败---');
  }
});
*/













