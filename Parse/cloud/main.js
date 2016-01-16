require('cloud/app.js');

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


// Parse.Cloud.afterSave("Note", function(request) {
//   var query = new Parse.Query("RedBook");

//   query.get(request.object.get("redBook").id, {
//     success: function(redBook) {

//       var notes = redBook.get('notes');
//       var i=0, isNew = true;
//       for(; i< notes.length; ++i){
//         if( notes[i] === request.object.id) {
//           isNew = false;
//           break;
//         }
//       }

//       if( isNew ){
//         notes.push(request.object.id);
//         redBook.set("notes", notes);
//         redBook.save()        
//       }

//     },
//     error: function(error) {
//       console.error("Got an error afterSave Note: ", error);
//     }
//   });
// });


Parse.Cloud.afterDelete("Note", function(request) {

  // 관련 댓글도 모두 삭제한다. 
  var query = new Parse.Query("Comment");
  query.equalTo("parent", request.object);
  query.find({
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

  // // 일단 레드북 노트목록에서도 ID를 제거하고, 
  // var redQuery = new Parse.Query("RedBook");
  // redQuery.get(request.object.get("redBook").id, {
  //   success: function(redBook) {

  //     var notes = redBook.get('notes');
  //     var i=0, isUpdate=false;

  //     for( ; i < notes.length; ++i ){
  //       if( notes[i] === request.object.id ){
  //         notes.splice(i, 1);
  //         isUpdate=true;
  //         break;
  //       }
  //     }

  //     if( isUpdate ){
  //       redBook.set("notes", notes);
  //       redBook.save()  
  //     }
  //},
  //   error: function(error) {
  //     console.error("노트를 지우다 에러났어!" + error);
  //   }
  // }); 
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

