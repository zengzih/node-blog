const mysql = require('mysql');
const express = require('express');

// 获取mysql的配置
const config = require('./config');
module.exports = (function() {
  const connection = mysql.createConnection(config);
  connection.connect((err)=> {
    if (!err) {
      console.log('---mysql链接成功----');
    } else {
      console.log('---mysql链接失败----');
    }
  });
  return connection;
})();