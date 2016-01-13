
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


Parse.Cloud.define("addComment", function(request, response) {
  response.success("Hello world!");
});


Parse.Cloud.afterSave("Comment", function(request) {
  var query = new Parse.Query("Note");
  var cmtId = request.object.id;

  query.get(request.object.get("parent").id, {
    success: function(note) {

      var comments = note.get('comments');
      comments.push(cmtId);

      note.set("comments", comments);
      note.save();

    },
    error: function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
    }
  });
});

Parse.Cloud.afterDelete("Comment", function(request) {
  var query = new Parse.Query("Note");
  var cmtId = request.object.id;

  query.get(request.object.get("parent").id, {
    success: function(note) {

      var comments = note.get('comments');
      var i=0; 
      for( ; i<comments.length; ++i ){
        if( comments[i] === cmtId ){
          comments.splice(i, 1);
          break;
        }
      }
      note.set("comments", comments);
      note.save();

    },
    error: function(error) {
      console.error("Error deleting related comments " + error.code + " : " + error.message);
    }
  });

});