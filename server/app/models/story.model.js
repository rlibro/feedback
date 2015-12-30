/**
 * 이야기 모델 
 * 1. 언제?   - 11월 22일 오후 5시쯤 (자동 생성)
 * 2. 어디서?  - 쿠바에서 (자동 위치 파악 가능)
 * 3. 누가?   - A가 B에게 
 * 4. 무엇을?  - 약을 
 * 5. 어떻게?  - 주었다. 
 * 6. 왜?     - 페루가면 고산병이 있으니 먹으라고,..
 */

'use strict';
var Sequelize = require('sequelize');
var sequelize = require('../../libs/database/instance');

module.exports = sequelize.define('story', {
  
  id:  { 
    type: Sequelize.INTEGER(11).UNSIGNED, 
    primaryKey: true,
    autoIncrement: true 
  },



  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },

  memberId: {
    type: Sequelize.INTEGER(11).UNSIGNED,
    allowNull: false,
    field: 'member_id'
  },
 

  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: 'created_at'
  },

  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    field: 'updated_at'
  }

}, {
  getterMethods: {},
  setterMethods: {},
  classMethods: {},
  instanceMethods: {},
  timestamps: false,
  underscored: true,
  freezeTableName: true // Model tableName will be the same as the model name
});