class DatabaseError extends Error {
  constructor(err) {
    super();
    this.result = false;
    this.type = 'database-error';
    this.message = err.sqlMessage;
    this.status = err.status;
  }
}

const databaseError = (err) => {
  if (err.errno === 1451) {
    err.sqlMessage = '데이터를 삭제한 뒤 다시 시도해주세요';
    return new DatabaseError(err);
  }

  if (err.errno === 1452) {
    err.sqlMessage = '조회된 데이터가 없습니다';
    return new DatabaseError(err);
  }

  if (err.errno === 1062) {
    err.status = 400;
    err.sqlMessage = '중복된 데이터는  들어갈 수 없습니다';
    return new DatabaseError(err);
  }

  return new DatabaseError(err);
};
module.exports = {
  DatabaseError,
  databaseError,
};
