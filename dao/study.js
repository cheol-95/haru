const pool = require('../configs/mysql');
const { databaseError } = require('../utils/errors/database');

const createStudy = async (user_id, createData) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const createSql = `
      INSERT INTO study
      SET ?`;
    const [createRows] = await conn.query(createSql, [createData]);

    const participateSql = `
      INSERT INTO participate
      SET ?`;
    await conn.query(participateSql, [{ user_id, study_id: createRows.insertId, leader: true }]);

    await conn.commit();
    return createRows;
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const checkTitle = async (title) => {
  const conn = await pool.getConnection();
  try {
    const checkSql = `
      SELECT id
      FROM study
      WHERE title = ?`;
    const [checkRows] = await conn.query(checkSql, [title]);
    return checkRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getStudy = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const studySql = `
      SELECT
        s.id, s.category, s.title ,s.introduce, s.image, s.progress, s.study_time, s.sns_notion, s.sns_evernote, s.sns_web,
        s.latitude Llatitude, s.longitude Llongitude, s.address_name Laddress_name, s.place_name Lplace_name, s.location_detail Llocation_detail,
        p.id Pid, p.user_id Puser_id, u.nickname Pnickname, u.image Pimage, p.leader Pleader
      FROM
        study s
          LEFT JOIN participate p
          ON s.id = p.study_id
          LEFT JOIN user u
          ON u.id = p.user_id
      WHERE s.id = ?
      ORDER BY leader DESC`;
    const [studyRows] = await conn.query(studySql, [study_id]);
    await conn.commit();
    return studyRows;
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getImage = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    const imageSql = `
      SELECT image 
      FROM study 
      WHERE id = ?`;
    const [imageRows] = await conn.query(imageSql, [study_id]);
    return imageRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const updateStudy = async (study_id, updateData) => {
  const conn = await pool.getConnection();
  try {
    const updateSql = `
      UPDATE study
      SET ?
      WHERE id = ?`;
    const [updateRows] = await conn.query(updateSql, [updateData, [study_id]]);
    return updateRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const deleteStudy = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const userSql = `
      SELECT user_id
      FROM participate
      WHERE study_id = ?`;
    const [userRows] = await conn.query(userSql, [study_id]);

    const studySql = `
      DELETE FROM study
      WHERE id = ?`;
    const [studyRows] = await conn.query(studySql, [study_id]);

    await conn.commit();
    return [userRows, studyRows];
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getMyStudy = async (user_id) => {
  const conn = await pool.getConnection();
  try {
    const myStudySql = `
      SELECT s.id, s.title, s.sigungu, s.image
      FROM participate p
        INNER JOIN study s
        ON p.study_id = s.id
      WHERE p.user_id = ?
      ORDER BY id DESC`;
    const [myStudyRows] = await conn.query(myStudySql, [user_id]);
    return myStudyRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getStudyListByNew = async (user_id, category) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const countingSql = `
    UPDATE
      category_count
    SET
      ${category} = ${category} + 1
    WHERE
      user_id = ?`;
    await conn.query(countingSql, [user_id]);

    const studyListSql = `
      SELECT
        S.*, count(*) member_count, IF(user_id is not null, true, false) is_member
      FROM (
        SELECT
          s.id id, s.title, s.introduce, s.image, s.sigungu, u.image leader_image, UNIX_TIMESTAMP(s.created_at) as created_at
        FROM
          study s
          LEFT JOIN participate p
          ON s.id = p.study_id
          LEFT JOIN user u
          ON u.id = p.user_id
        WHERE category = ?
        ORDER BY p.leader DESC ) S
      LEFT JOIN (
        SELECT user_id, study_id
        FROM participate
        WHERE user_id = ? ) P
      ON S.id = P.study_id
      GROUP BY S.id
      ORDER BY S.id DESC`;
    const [listRows] = await conn.query(studyListSql, [category, user_id]);
    await conn.commit();

    return listRows;
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getStudyListByLength = async ({ latitude, longitude }, user_id, category) => {
  const conn = await pool.getConnection();
  try {
    const studyListSql = `
      SELECT
        S.*, count(*) member_count, IF(user_id is not null, true, false) is_member
      FROM (
        SELECT
          s.id id, s.title, s.introduce, s.image, s.sigungu, u.image leader_image,
          UNIX_TIMESTAMP(s.created_at) as created_at,
          (6371*acos(cos(radians( ? ))*cos(radians( s.latitude ))*cos(radians( s.longitude )
          -radians( ? ))+sin(radians( ? ))*sin(radians( s.latitude )))) AS distance
        FROM
          study s
          LEFT JOIN participate p
          ON s.id = p.study_id
          LEFT JOIN user u
          ON u.id = p.user_id
        WHERE category = ?
        ORDER BY p.leader DESC ) AS S
      LEFT JOIN (
        SELECT user_id, study_id
        FROM participate
        WHERE user_id = ?) AS P
      ON S.id = P.study_id
      GROUP BY S.id
      ORDER BY S.distance
      `;
    const [listRows] = await conn.query(studyListSql, [longitude, latitude, longitude, category, user_id]);
    return listRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const studyPaging = async (user_id, studyKeys) => {
  const params = [...studyKeys, ...studyKeys, user_id];
  const conn = await pool.getConnection();
  try {
    const studyListSql = `
      SELECT
        S.*, IF(P.user_id is not null, true, false) is_member
      FROM (
        SELECT
          *, count(*) member_count
        FROM (
          SELECT
            s.id, s.title, s.introduce, s.image, s.sigungu, u.image leader_image,
            UNIX_TIMESTAMP(s.created_at) as created_at
          FROM
            study s
            LEFT JOIN participate p
            ON s.id = p.study_id
            LEFT JOIN user u
            ON u.id = p.user_id
          WHERE s.id in (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)) A
        GROUP BY id
        ORDER BY FIELD(id, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)) S
      LEFT JOIN (
        SELECT user_id, study_id
        FROM participate
        WHERE user_id = ? ) P
      ON S.id = P.study_id`;
    const [listRows] = await conn.query(studyListSql, params);
    return listRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const studyPagingByLength = async ({ latitude, longitude }, user_id, studyKeys) => {
  const params = [longitude, latitude, longitude, ...studyKeys, ...studyKeys, user_id];
  const conn = await pool.getConnection();
  try {
    const studyListSql = `
      SELECT
        S.*, IF(P.user_id is not null, true, false) is_member
      FROM (
        SELECT
          *, count(*) member_count
        FROM (
          SELECT
            s.id, s.title, s.introduce, s.image, s.sigungu, u.image leader_image,
            UNIX_TIMESTAMP(s.created_at) as created_at,
            (6371*acos(cos(radians( ? ))*cos(radians( s.latitude ))*cos(radians( s.longitude )
            -radians( ? ))+sin(radians( ? ))*sin(radians( s.latitude )))) AS distance
          FROM
            study s
            LEFT JOIN participate p
            ON s.id = p.study_id
            LEFT JOIN user u
            ON u.id = p.user_id
          WHERE s.id in (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)) A
        GROUP BY id
        ORDER BY FIELD(id, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)) S
      LEFT JOIN (
        SELECT user_id, study_id
        FROM participate
        WHERE user_id = ? ) P
      ON S.id = P.study_id`;
    const [listRows] = await conn.query(studyListSql, params);
    return listRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const leaveStudy = async (user_id, study_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const participateSQL = `
      DELETE FROM participate
      WHERE user_id = ?
        AND study_id = ?`;
    const participateRows = await conn.query(participateSQL, [user_id, study_id]);

    const applySql = `
      DELETE FROM apply
      WHERE user_id = ?
        AND study_id = ?`;
    await conn.query(applySql, [user_id, study_id]);

    const alertSQL = `
      DELETE FROM alert
      WHERE user_id = ?
        AND study_id = ?`;
    await conn.query(alertSQL, [user_id, study_id]);

    await conn.commit();
    return participateRows;
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const delegate = async (study_id, old_leader, new_leader) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const updateSql = `
      UPDATE participate
      SET leader = ?
      WHERE study_id = ?
        AND user_id = ?`;
    const toParticipateRows = await conn.query(updateSql, [false, study_id, old_leader]);

    const toLeaderRows = await conn.query(updateSql, [true, study_id, new_leader]);

    await conn.commit();
    return { toLeaderRows, toParticipateRows };
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const search = async (user_id, word) => {
  const conn = await pool.getConnection();
  try {
    const searchSql = `
    SELECT
      S.*, count(*) member_count, IF(user_id is not null, true, false) is_member
    FROM (
      SELECT
        s.id id, s.title, s.introduce, s.image, s.sigungu, u.image leader_image,
        UNIX_TIMESTAMP(s.created_at) as created_at
      FROM
        study s
        LEFT JOIN participate p
        ON s.id = p.study_id
        LEFT JOIN user u
        ON u.id = p.user_id
      WHERE
        s.title like ? OR s.introduce like ? OR s.sigungu like ?
      ORDER BY p.leader DESC ) AS S
    LEFT JOIN (
      SELECT user_id, study_id
      FROM participate
      WHERE user_id = ?) AS P
    ON S.id = P.study_id
    GROUP BY S.id
    ORDER BY S.id DESC
    `;
    const [searchRows] = await conn.query(searchSql, [word, word, word, user_id]);
    return searchRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getCategoryRanking = async (user_id) => {
  const conn = await pool.getConnection();
  try {
    const categorySql = `
    SELECT
      ai, android, backend, bigdata, blockchain, project, devops, embedded, etc, frontend, game, ios, iot, language, network, security
    FROM category_count
    WHERE user_id = ?
    `;
    const [categoryRows] = await conn.query(categorySql, [user_id]);
    return categoryRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

module.exports = {
  createStudy,
  getStudy,
  getImage,
  updateStudy,
  deleteStudy,
  getMyStudy,
  getStudyListByNew,
  getStudyListByLength,
  studyPaging,
  studyPagingByLength,
  checkTitle,
  leaveStudy,
  delegate,
  search,
  getCategoryRanking,
};
