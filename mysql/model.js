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
        let {table, select, where, limit, count} = args; // limit：分页
        if (select) {
          select = `select ${select.join(',')} from ${tables[table]} `;
        } else {
          select = `select * from ${tables[table]}`;
        }
        if (limit) {
          select += ` limit ${limit}`;
        }
        if (count) {
          select = `select count(*) from ${tables[table]}`;
        }
        const field = [],
              values = [];
        where = where || {};
        Object.keys(where).forEach(key => {
          field.push(""+key+"=?");
          values.push(where[key]);
        });
        let sql = select;
        if (field.length) {
          sql = select + `where ${field.join(' and ')}`;
        }
        return new Promise((resolve, reject)=> {
          connection.query(sql, values, (err, result, fields)=> {
            if (err) {
              reject(err);
            } else {
              if (count) {
                result = result[0]['count(*)'];
              }
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