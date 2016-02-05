require('cloud/app.js');

// 좋아요는 노트-유저 쌍이 유일해야한다.
Parse.Cloud.beforeSave("Like", function(request, response) {
  
  if( !request.object.get("note") ){
    response.error('A Like Object must have a note.');
  } else {


    var query = new Parse.Query("Like");
    query.equalTo("note", request.object.get("note"));
    query.equalTo("user", request.object.get("user"));
    query.first({
      success: function(object) {
        if (object) {
          object.destroy();
          response.error("A Like User already exists.");
        } else {
          response.success();
        }
      },
      error: function(error) {
        response.error("Could not validate uniqueness for this BusStop object.");
      }
    });
  }
  
});



// 체크인 하면, 유저 정보에 현재 
Parse.Cloud.afterSave("CheckIn", function(request) {
  
  var query = new Parse.Query(Parse.User);
  
  query.get(request.object.get("person").id, {
    success: function(user) {

      var redQuery = new Parse.Query('RedBook');
      redQuery.get(request.object.get('city').id)
      .then(function(redBook){

        user.set('currentCity', redBook.get('uname'));
        user.save();
      })
    },
    error: function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
    }
  });
});


Parse.Cloud.afterDelete("Note", function(request) {

  // 관련 댓글도 모두 삭제한다. 
  var commentQuery = new Parse.Query("Comment");
  commentQuery.equalTo("parent", request.object);
  commentQuery.find({
    success: function(comments) {
      Parse.Object.destroyAll(comments, {
        success: function() {},
        error: function(error) {
          console.error("레드북에서 노트를 지우고 난뒤에 관련 댓글 지우다 에러났다!", error);
        }
      });
    },
    error: function(error) {
      console.error("Error finding related comments ", error);
    }
  });

  // 관련 장소도 모두 삭제한다.
  var placeQuery = new Parse.Query("Place");
  placeQuery.equalTo("note", request.object);
  placeQuery.find({
    success: function(places) {
      Parse.Object.destroyAll(places, {
        success: function() {},
        error: function(error) {
          console.error("노트를 지우고 난뒤에 관련 장소를 지우다 에러났다!", error);
        }
      });
    },
    error: function(error) {
      console.error("Error finding related places ", error);
    }
  });

});

Parse.Cloud.afterSave("Comment", function(request) {
  var query = new Parse.Query("Note");
  
  query.get(request.object.get("parent").id, {
    success: function(note) {

      var comments = note.get('comments');
      var i=0, isNew = true;
      for(; i< comments.length; ++i){
        if( comments[i] === request.object.id) {
          isNew = false;
          break;
        }
      }

      if( isNew ){
        comments.push(request.object.id);
        note.set("comments", comments);
        note.save();      
      }

    },
    error: function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
    }
  });
});

Parse.Cloud.afterDelete("Comment", function(request) {
  var query = new Parse.Query("Note");

  query.get(request.object.get("parent").id, {
    success: function(note) {

      if( note ){
        var comments = note.get('comments');
        var i=0, isUpdate=false;

        for( ; i<comments.length; ++i ){
          if( comments[i] === request.object.id ){
            comments.splice(i, 1);
            isUpdate=true;
            break;
          }
        }

        if( isUpdate ){
          note.set("comments", comments);
          note.save();  
        }
      }
    },
    error: function(error) {
      console.error("Error deleting related comments - ", JSON.stringify(error));
    }
  });

});

