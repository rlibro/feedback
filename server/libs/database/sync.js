'use strict';
var Member   = require('../../app/models/member.model');
var Post     = require('../../app/models/post.model');
var Comment  = require('../../app/models/comment.model');
var ReadPost = require('../../app/models/read_post.model');
var LikePost = require('../../app/models/like_post.model');
var Q = require('q');
    Q.longStackSupport = true;

function syncAllTables(opt){
  var deferred = Q.defer();

  LikePost.sync(opt);
  ReadPost.sync(opt);
  Member.sync(opt).then(function(){
    Post.sync(opt).then(function(){
      Comment.sync(opt).then(function(){
        console.log("\n----------- sync all tables ------------ \n\n")
        deferred.resolve();
      })
    })
  })

  return deferred.promise;
}

module.exports = function(opt){
  var deferred = Q.defer();

  opt = opt || {force:false}

  syncAllTables(opt).then(function(){
    deferred.resolve();
  });

  return deferred.promise;
};