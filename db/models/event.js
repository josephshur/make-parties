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

// const Event = sequelize.define('Event', {
//     title: DataTypes.STRING,
//     desc: DataTypes.TEXT,
//     imgUrl: DataTypes.STRING //add this line (don't forget the comma above!)
//   }, {});

// module.exports = (sequelize, DataTypes) => {
//   class Event extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   Event.init({
//     title: DataTypes.STRING,
//     desc: DataTypes.TEXT
//   }, {
//     sequelize,
//     modelName: 'Event',
//   });
//   return Event;
// };
