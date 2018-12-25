// 在应用中通过操作模型类来对数据进行操作
const mongoose = require('mongoose');
const userSchema = require('../schemas/users');

// 创建模型类
module.exports = mongoose.model('User', userSchema);