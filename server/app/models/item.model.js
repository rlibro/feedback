'use strict';
var Sequelize = require('sequelize');
var sequelize = require('../../libs/database/instance');
var crypto = require('crypto');

var Item = sequelize.define('item', {
  
  id:  { 
    type: Sequelize.INTEGER(11).UNSIGNED, 
    primaryKey: true,
    autoIncrement: true 
  },

  name: {
    type: Sequelize.STRING(40),
    allowNull: false
  },

  profileImageUrl: {
    type: Sequelize.STRING,
  },

  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: 'created_at'
  },

  lastLoggedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: 'last_logged_at'
  }
  
}, {
 
  getterMethods: {},
  setterMethods: {},
  classMethods: {},
  instanceMethods: {},
  underscored: true,
  timestamps: false,
  freezeTableName: true // Model tableName will be the same as the model name
});

module.exports = Item;