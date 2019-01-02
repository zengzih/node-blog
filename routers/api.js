const express = require('express');
// const app = express();
// const User = require('../models/User');
// const connect = require('../mysql/connect');
const UseDB = require('../mysql/model')
const router = express.Router();
const userdb = new UseDB();
router.get('/user', (req, res, next)=> {
  res.send('api-user');
});

// 统一数据返回格式
let responseData;
router.use((req, res, next)=> {
  responseData = {
    code: 0,
    message: '',
  };
  next();
});

/*
* 注册逻辑
*   1、用户是否已经被注册
*     数据库查询
* */

router.post('/user/register', (req, res, next)=> {
  const { username, password } = req.body;
  userdb.commit({
    type: 'query',
    table: 'user',
    where: { username }
  }).then((args)=> {
    debugger;
    if (!args.err) {
      if (!args.result.length) {
        userdb.commit({
          table: 'user',
          type: 'insert',
          insert: {username, password}
        }).then((args)=> {
          if(!args.err) {
            responseData.code = 0;
            responseData.message = '注册成功';
            res.json(responseData);
          }
        });
      } else {
        responseData.code = 1;
        responseData.message = '当前用户已注册';
        res.json(responseData);
      }
    } else {
      responseData.code = 1;
      responseData.message = args.err;
      res.json(responseData);
    }
  });
});

router.post('/user/login', (req, res, next)=> {
  const { username, password } = req.body;
  userdb.commit({
    type: 'query',
    table: 'user',
    where: { username, password}
  }).then(args=> {
    if (args.result.length > 0) {
      responseData.message = '登录成功';
      responseData.userInfo = {
          _id: args.result[0].ID,
        username: args.result[0].USERNAME,
        isAdmin: args.result[0].isAdmin
      };
      req.cookies.set('userInfo', JSON.stringify(responseData.userInfo));
      res.json(responseData);
    } else {
      responseData.code = 1;
      responseData.message = '用户名和密码不匹配';
      res.json(responseData);
    }
  }).catch((err)=> {
    responseData.code = 2;
    responseData.message = '登录失败' + err.toString();
    res.json(responseData);
  })
});

// 退出
router.get('/user/logout', (req, res)=> {
  req.cookies.set('userInfo', null);
  res.json(responseData);
});
module.exports = router;
