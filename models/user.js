module.exports = class User {
  constructor(id, email, fullName, isAdmin) {
    this._id = id;
    this._email = email;
    this._fullName = fullName;
    this._isAdmin = isAdmin;
  }
};
