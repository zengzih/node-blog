const express = require('express');
// 创建app应用 == Node.js 中的http.createServer();
const app = express();


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



/*
* 首页
* req
* res
* next 函数
* */
app.get('/', (req, res, next)=> {
  // res.send('<h2>我的blog</h2>');
  
  /*
  * 读取views目录下指定的文件，解析并返回给客户端
  * 第一个参数：表示模板的文件，相对于views目录
  * */
  res.render('index');
});

/*// 请求静态文件也算路由 (这种方式不够灵活，使用express静态文件托管)
app.get('/main.css', (req, res, next)=> {
  res.setHeader('content-type', 'text/css');
  res.send('body{ background: red; }');
});*/

// 使用express静态文件托管
// 当用户请求的文件的路径是以./public开始的，则调用后面的方式来进行处理（对 __dirname + '/public' 下的文件进行处理）,
app.use('/public', express.static(__dirname + '/public'));


// 监听http请求     
app.listen(8088, 'localhost');

/*
* 用户发送http请求——> url ——> 解析路由 ——> 找到匹配的规则 ——> 执行指定的绑定函数，返回内容给用户。
*
* /public -> 静态 -> 直接指定目录下的文件给用户。
*
* 动态-> 处理业务咯，加载模块，解析模块，-> 返回数据给用户。
* */






