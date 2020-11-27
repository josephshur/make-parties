'use strict';

const bcrypt = require('bcrypt');
const sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
    // UserID: DataTypes.INTEGER
  })

  User.associate = function(models) {
    User.hasMany(models.Event);
  }

  User.addHook('beforeCreate', async function(user) {
    const salt = await bcrypt.genSalt(10); //whatever number you want
    user.password = await bcrypt.hash(user.password, salt);
    console.log("BeforeCreate:", user);
  })

  User.prototype.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
    return done(err, isMatch);
  });
};

  return User;
};
