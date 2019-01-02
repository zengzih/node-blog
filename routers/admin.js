const express = require('express');
const router = express.Router();
const UseDB = require('../mysql/model');
const db = new UseDB();

router.get('/user', (req, res, next)=> {
  db.commit({
    type: 'query',
    count: true,
    table: 'user'
  }).then((data)=> {
    const { result: count } = data;
    const limit = 2;
    let pages = 0; // 总页数
    let page = Number(req.query.page) || 1;
    // 计算总页数
    pages = Math.ceil(count / limit);
    // 取值不能超过pages
    page = Math.min(page, pages);
    // 取值不能小于1
    page = Math.max(page, 1);
    db.commit({
      type: 'query',
      limit: ' '+ ((page - 1) * limit) + ',' + ((page - 1) * limit + limit) +' ',
      table: 'user'
    }).then((data)=> {
      const { result } = data;
      res.render('admin/user_index', {
        userInfo: req.userInfo,
        users: result,
        page,
        pages
      });
    });
  })
});

router.use((req, res, next)=> {
  if (!req.userInfo.isAdmin) {
    res.send('对不起，只有管理人才可以进入后台管理');
    return;
  }
  next();
});
router.get('/', (req, res, next)=> {
  res.render('admin/index', {
    userInfo: req.userInfo,
  });
});

module.exports = router;