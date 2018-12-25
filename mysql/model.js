const config = require('../mysql/config');
const tables = require('../mysql/tables');
const connection = require('./connect');
class UseDB {
  constructor() {
    this.mutations = {
      insert(args = {}) {
        const insert = args.insert || {},
        field = [],
        values = [],
        place = [];
        Object.keys(insert).forEach(key=> {
          field.push(key);
          values.push(insert[key]);
          place.push('?');
        });
        const sql = `insert into ${tables[args.table]} (${field.join(',')}) values (${place.join(',')})`;
        return new Promise((resolve, reject)=> {
          connection.query(sql, values, (err, result)=> {
            resolve({err, result});
          });
        });
      },
      query(args = {}) {
        let {table, select, where} = args;
        if (select) {
          select = `select ${select.join(',')} from ${tables[table]} `;
        } else {
          select = `select * from ${tables[table]} `;
        }
        const field = [],
              values = [];
        where = where || {};
        Object.keys(where).forEach(key => {
          field.push(""+key+"=?");
          values.push(where[key]);
        });
        let sql = select + `where ${field.join(' and ')}`;
        return new Promise((resolve, reject)=> {
          connection.query(sql, values, (err, result, fields)=> {
            if (err) {
              reject(err);
            } else {
              resolve({err, result, fields});
            }
          })
        });
      }
    }
  }
  commit(args = {}) {
    if (this.mutations[args.type]) {
      return this.mutations[args.type].call(this, args)
    } else {
      console.log('没有这个方法');
    }
  }
}
module.exports = UseDB;