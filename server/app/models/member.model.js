/**
 * Mooving 에 회원으로 가입하자.
 * 1. 소셜 플러그인(Facebook, Google)을 통해 가입한다. 
 * 2. 직접 가입한다. 
 * 3. 필수) 아이디(uid), 이메일(email), 비밀번호(password) 
 * 4. 선택) 국적, 현재 사는곳, 주로 쓰는 언어
 */

'use strict';
var Sequelize = require('sequelize');
var sequelize = require('../../libs/database/instance');
var crypto = require('crypto');

var Member = sequelize.define('member', {
  
  id:  { 
    type: Sequelize.INTEGER(11).UNSIGNED, 
    primaryKey: true,
    autoIncrement: true 
  },

  name: {
    type: Sequelize.STRING(20)
  },

  facebookId: {
    type: Sequelize.STRING(20),
    unique: true,
    field: 'facebook_id'
  },

  hashedPassword: {
    type: Sequelize.STRING,
    field: 'hashed_password'
  },

  salt: {
    type: Sequelize.STRING
  },

  email: {
    type: Sequelize.STRING(80),
    unique: true,
    allowNull: false
  },

  // 부가 정보 국적
  nationality: {
    type: Sequelize.STRING(80),
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

  getterMethods: {
    //password : function()  { return this.hashedPassword }
  },
  setterMethods: {
    password: function(password) { 
      this.salt = Member.makeSalt();
      this.setDataValue('hashedPassword', Member.encryptPassword(password, this.salt));
    },
  },
  
  classMethods: {
    
    makeSalt: function() {
      return crypto.randomBytes(16).toString('base64');
    }, 

    encryptPassword: function(password, salt) {
      if (!password || !salt) return '';
      
      salt = new Buffer(salt, 'base64');
      
      return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    },   
  },

  instanceMethods: {

    
    authenticate: function(plainText) {

      return Member.encryptPassword(plainText, this.salt) === this.hashedPassword;
    },

  },
  underscored: true,
  timestamps: false,
  freezeTableName: true // Model tableName will be the same as the model name
});

module.exports = Member;