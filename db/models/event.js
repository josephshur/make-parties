'use strict';

const sequelize = require('sequelize');

// models/todo.js
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    title: DataTypes.STRING,
    desc: DataTypes.TEXT,
    imgUrl: DataTypes.STRING
  }, {});

  Event.associate = function(models) {
    // associations can be defined here
  };

  return Event;
};
