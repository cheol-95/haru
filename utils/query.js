const { format } = require('mysql2');
const { DeviceEnum } = require('./variables/enum');

const rowSplit = (rows, tags) => {
  let [result, keys, tempModel, insertedId] = [{}, {}, {}, {}];

  tags.forEach((tag) => {
    result[tag] = [];
    tempModel[tag] = {};
    insertedId[tag] = [];
    keys[tag[0].toUpperCase()] = tag;
  });

  rows.forEach((row, idx) => {
    let temp = tempModel;
    for (const [key, value] of Object.entries(row)) {
      if (idx === 0 && !(key[0] in keys)) {
        result[key] = row[key];
      } else if (key[0] in keys) {
        temp[keys[key[0]]][key.slice(1)] = value;
      }
    }

    for (const [key, value] of Object.entries(temp)) {
      if (insertedId[key].indexOf(value.id) === -1 && Object.keys(value).length && value.id) {
        insertedId[key].push(value.id);
        result[key].push(Object.assign({}, value));
      }
    }
  });
  return result;
};

const toBoolean = (rows, tags) => {
  rows.forEach((row) => {
    tags.forEach((tag) => (row[tag] = Boolean(row[tag])));
  });
  return rows;
};

const locationMerge = (row) => {
  row.location = {};
  for (const [key, value] of Object.entries(row)) {
    if (key[0] === 'L') {
      row.location[key.slice(1)] = value;
      delete row[key];
    }
  }
  return row;
};

const cutId = (rows) => {
  return rows.map((row, idx) => {
    if (idx < process.env.paging_size) {
      row.is_paging = false;
      return row;
    } else {
      return {
        id: row.id,
        is_paging: true,
      };
    }
  });
};

const lengthSorting = (sigungu, rows) => {
  let [targetRows, otherRows] = [[], []];

  rows.forEach((row, idx) => {
    if (row.sigungu === sigungu) {
      targetRows.push(rows[idx]);
    } else {
      otherRows.push(rows[idx]);
    }
  });

  return targetRows.concat(otherRows);
};

const parsingAddress = (addressRows) => {
  const location = [];
  const tmp = {
    sido: addressRows[0].sido,
    sigungu: [],
  };

  addressRows.forEach((item) => {
    if (tmp.sido !== item.sido) {
      location.push(Object.assign({}, tmp));
      tmp.sido = item.sido;
      tmp.sigungu = [];
    }
    tmp.sigungu.push(item.sigungu);
  });

  location.push(tmp);
  return location;
};

const multiInsertQuery = (table, insertData) => {
  const keys = Object.keys(insertData[0]);
  const escapeKeys = Array.from(keys, (x) => '?');

  let sql = `INSERT INTO ${table} (${keys}) VALUES `;
  let data = [];

  insertData.forEach((item) => {
    sql += `(${escapeKeys}), `;
    data = data.concat(Object.values(item));
  });

  return format(sql.slice(0, sql.length - 2), data);
};

module.exports = {
  rowSplit,
  toBoolean,
  locationMerge,
  cutId,
  lengthSorting,
  parsingAddress,
  multiInsertQuery,
};
