const tables = require("../../database/tables");

const addSkill = async (req, res, next) => {
  try {
    const [result] = await tables.user.addSkill(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const edit = async (req, res, next) => {
  try {
    console.info(req.file, req.auth);
    const uploadDest = `http://localhost:${process.env.APP_PORT}/upload/`;
    if (req.file) req.body.avatar = uploadDest + req.file.filename;
    const [result] = await tables.user.update(req.body, req.auth.id);
    if (result.affectedRows > 0) {
      const [[user]] = await tables.user.read(req.auth.id);
      res.status(200).json(user);
    }
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
}

module.exports = {addSkill, edit};