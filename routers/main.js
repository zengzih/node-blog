const express = require('express');
const router = express.Router();

router.get('/', (req, res, next)=> {
  console.log(req.userInfo);
  res.render('main/index', { // 分配给模板使用的数据
    userInfo: req.userInfo
  });
});
module.exports = router;