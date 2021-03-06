import { Schema, arrayOf, normalize } from 'normalizr'
import { camelizeKeys } from 'humps'
import _ from 'lodash'

const userSchema = new Schema('users', { idAttribute: 'id' })
const redBookSchema = new Schema('redBooks', { idAttribute: 'id' })
const noteSchema = new Schema('notes', {  idAttribute: 'id'})
const commentSchema = new Schema('comments', {idAttribute: 'id'})
const likeSchema = new Schema('likes', {idAttribute: 'id'})
const placeSchema = new Schema('places', {  idAttribute: 'id'})
const resultSchema = new Schema('findings', {  idAttribute: 'id'})

export const Schemas = {
  USER: userSchema,
  USER_ARRAY: arrayOf(userSchema),
  REDBOOK: redBookSchema,
  REDBOOK_ARRAY: arrayOf(redBookSchema),
  NOTE: noteSchema,
  NOTE_ARRAY: arrayOf(noteSchema),
  COMMENT: commentSchema,
  COMMENT_ARRAY: arrayOf(commentSchema),
  LIKE: likeSchema,
  LIKE_ARRAY: arrayOf(likeSchema),
  PLACE: placeSchema,
  PLACE_ARRAY: arrayOf(placeSchema),
  RESULT: resultSchema,
  RESULT_ARRAY: arrayOf(resultSchema)
}

const RedBook = Parse.Object.extend('RedBook');
const Note = Parse.Object.extend('Note');
const Comment = Parse.Object.extend('Comment');
const CheckIn = Parse.Object.extend('CheckIn');
const Place = Parse.Object.extend('Place');
const Like = Parse.Object.extend('Like');

function clearObjectId(obj, key){
  obj.id = obj.objectId;
  delete obj.objectId;

  if( key && obj[key] ){
    obj[key].id = obj[key].objectId;

    delete obj[key].__type;
    delete obj[key].authData;
    delete obj[key].email;
    delete obj[key].objectId;
    delete obj[key].sessionToken;
    delete obj[key].type;
    delete obj[key].className;    
  }
}

const parseAPI = {

  searchRedbook: function(schema, params){

    let query = new Parse.Query(RedBook);
    let regex = new RegExp(`${params.keyword}`, 'i')

    query.ascending('cityName');
    query.matches('uname', regex);

    return query.find()
    .then(function(data) {
      data.forEach(function(o, i, a){
        const camelizedJson = camelizeKeys(o.toJSON());
      
        clearObjectId(camelizedJson, 'creator');

        a[i] = camelizedJson;
      });

      
      let response = Object.assign({}, normalize(data, schema));
      response.query = params.keyword;
      response.mode = params.mode;

      return response;
         
    }, function(error) {
      return error.code + ', ' + error.message;
    });

  },

  searchUser: function(schema, params){

    let query1 = new Parse.Query(Parse.User);
    let query2 = new Parse.Query(Parse.User);
    let regex = new RegExp(`${params.keyword}`, 'i')

    query1.matches('username', regex);
    query2.matches('nationality', regex);

    var compoundQuery = Parse.Query.or(query1, query2);
    compoundQuery.ascending('username');

    return compoundQuery.find()
    .then(function(data) {
      data.forEach(function(o, i, a){
        const camelizedJson = camelizeKeys(o.toJSON());
      
        clearObjectId(camelizedJson, 'creator');

        a[i] = camelizedJson;
      });

      
      let response = Object.assign({}, normalize(data, schema));
      response.query = params.keyword;
      response.mode = params.mode;

      return response;
         
    }, function(error) {
      return error.code + ', ' + error.message;
    });

  },

  fetchCityPeoples: function(schema, params){

    let query = new Parse.Query(Parse.User);
    query.equalTo('currentCity', params.uname);

    return query.find()
    .then(function(data){

      data.forEach(function(o, i, a){
        const camelizedJson = o.toJSON();
        clearObjectId(camelizedJson);
        a[i] = camelizedJson;
      });

      return Object.assign({}, normalize(data, schema));

    }, function(error) {
      return error.code + ', ' + error.message;
    });    
  },

  fetchRedBooks: function (schema) {

    let query = new Parse.Query(RedBook);
    query.descending('updatedAt');
    //query.ascending('cityName');

    return query.find()
    .then(function(data) {
      data.forEach(function(o, i, a){
        const camelizedJson = camelizeKeys(o.toJSON());
      
        clearObjectId(camelizedJson, 'creator');

        a[i] = camelizedJson;
      });

      return Object.assign({}, normalize(data, schema));
         
    }, function(error) {
      return error.code + ', ' + error.message;
    });
  },

  fetchNotes: function (schema, params) {

    let noteQuery = new Parse.Query(Note);
    let commentQuery = new Parse.Query(Comment);
    let redBook = new RedBook();

    redBook.id = params.redBookId;

    noteQuery.equalTo('redBook', redBook);
    noteQuery.include('author');
    noteQuery.descending('createdAt');


    return noteQuery.find()
    .then(function(results) {

      results.forEach(function(note, i, a){

        const camelizedJson = camelizeKeys(note.toJSON());
        clearObjectId(camelizedJson, 'author');

        a[i] = camelizedJson;
      
      });

      return Object.assign({}, normalize(results, schema));
         
    }, function(error) {

      return error.code + ', ' + error.message;

    })
  },

  fetchNote: function (schema, params) {

    let query = new Parse.Query(Note);
        query.include('redBook');
        query.include('author');
    
    return query.get(params.noteId)
    .then(function(note) {
      
      let promises = [];
      let placeQuery = new Parse.Query(Place);
      let commentQuery = new Parse.Query(Comment);
      let entities = {
        notes: {},
        comments: {},
        places:{}
      };
      
      commentQuery.equalTo('parent', note);
      placeQuery.equalTo('note', note);
           
      promises.push(commentQuery.find());
      promises.push(placeQuery.find());

      return Parse.Promise.when(promises)
      .then(function(comments, places){


        let jsonNote = note.toJSON();
        clearObjectId(jsonNote, 'author');

        let jsonRedBook = note.get('redBook').toJSON();
        clearObjectId(jsonRedBook, 'creator');
        
        jsonNote.redBook = jsonRedBook;   
        entities.notes[note.id] = jsonNote;

        _.each(comments, function(comment){

          let jsonComment = comment.toJSON();
          clearObjectId(jsonComment, 'author');
          entities.comments[comment.id] = jsonComment;

        });

        _.each(places, function(place){

          let jsonPlace = place.toJSON();
          clearObjectId(jsonPlace, 'author');
          entities.places[place.id] = jsonPlace;

        });



        return Object.assign({}, {entities});
      });

         
    }, function(error) {

      return error.code + ', ' + error.message;

    })
  },

  fetchComments: function (schema, params) {

    let commentQuery = new Parse.Query(Comment);
    let note = new Note();

    note.id = params.noteId;

    commentQuery.equalTo('parent', note);
    commentQuery.include('author');
  
    return commentQuery.find()
    .then(function(results) {

      results.forEach(function(result, i, a){

        // 댓글에서 필요한 것만 뽑아내자!
        const author = result.get('author');
        const data = {
          id: result.id,
          author: {
            id: author.id,
            username: author.get('username'),
            picture: author.get('picture')
          },
          text: result.get('text'),
          createdAt: result.get('createdAt')
        }
        a[i] = data;
      
      });

      return Object.assign({}, normalize(results, schema));
         
    }, function(error) {

      return error.code + ', ' + error.message;

    })
  },

  fetchPlaces: function (schema, params) {

    let placeQuery = new Parse.Query(Place);

    if( params.redBookId ){
      placeQuery.equalTo('redBookId', params.redBookId);  
    }

    if( params.noteId) {
      let note = new Note();
      note.id = params.noteId;
      placeQuery.equalTo('note', note);
    }
    
    return placeQuery.find()
    .then(function(places) {

      _.each(places, function(place, i, a){

        let jsonPlace = place.toJSON();

        place.note = params.noteId;
        jsonPlace.id = place.id;
        delete jsonPlace.objectId;

        a[i] = jsonPlace;
      });

      return Object.assign({}, normalize(places, schema));
         
    }, function(error) {

      return error.code + ', ' + error.message;

    })
  },

  addRedBook: function(schema, params){

    const redBook = new RedBook();
    const note    = new Note();

    let geoPoint = new Parse.GeoPoint({
      latitude: params.RedBook.geo.lat,
      longitude: params.RedBook.geo.lng
    });
    params.RedBook.geo = geoPoint;

    delete params.RedBook.isFetching;

    redBook.set(params.RedBook);
    note.set(params.Note);
    note.set('redBook', redBook);
    
    return note.save()
    .then(function(note){
      let savedBook = note.get('redBook').toJSON();
      clearObjectId(savedBook, 'creator');
      return Object.assign({}, normalize(savedBook, schema));

    }, function(error){
      return error.code + ', ' + error.message;
    });

  }, 

  /**
   * 새 노트를 작성할땐 노트 저장이후에 노트 아이디를 
   * 첨부된 마커를 모두 업데이트 해줘야한다. 
   */
  addNote: function(schema, params){

    const note    = new Note();
    const redBook = new RedBook();
    redBook.id = params.redBookId;
    params.Note.redBook = redBook;

    return note
    .save(params.Note)
    .then(function(savedNote){

      var promises = [];
      _.each(params.Place, function(marker){

        const geoPoint = new Parse.GeoPoint({
          latitude: marker.position.lat,
          longitude: marker.position.lng
        });

        const place = new Place();
        place.id = marker.key;
        place.set('note', savedNote);
        place.set('title', marker.title);
        place.set('label', marker.label);
        place.set('geo', geoPoint);
        place.set('userId', params.Note.author.id);
        place.set('redBookId', params.redBookId);
        promises.push(place.save());

      });

      return Parse.Promise.when(promises)
      .then(function(){

        let newNote = savedNote.toJSON();
        clearObjectId(newNote, 'author');

        return Object.assign({}, normalize(newNote, schema));
      });

    }, function(error){
      return error.code + ', ' + error.message;
    })
  },

  addComment: function(schema, params){

    let note = new Note();
    note.id = params.noteId;

    const comment = new Comment();
    params.Comment.parent = note;

    // 1. 일단 댓글을 서버에 저장해!      
    return comment
    .save(params.Comment)
    .then(function(result){

      // 댓글에서 필요한 것만 뽑아내자!
      const author = result.get('author');
      const data = {
        id: result.id,
        author: {
          id: author.id,
          username: author.get('username'),
          picture: author.get('picture'),
          facebookId: author.get('facebookId')
        },
        text: result.get('text'),
        createdAt: result.get('createdAt')
      }

      return Object.assign({}, normalize(data, schema));

    }, function(error){
      return error.code + ', ' + error.message;
    })
    
  },

  addPlace: function(schema, params){

    const geoPoint = new Parse.GeoPoint({
      latitude: params.geoPoint.lat,
      longitude: params.geoPoint.lng
    });

    const place = new Place();

    place.set('geo', geoPoint);
    return place
    .save(params.Place)
    .then(function(savedPlace){

      let placeObject = savedPlace.toJSON();
      clearObjectId(placeObject);

      return Object.assign({}, normalize(placeObject, schema));
    });

  },

  updatePlace: function(schema, params){

    const place = new Place();
    place.id = params.placeId;

    const note = new Note();
    note.id = params.noteId;

    // 로직상 위치는 아직 수정하지 못함.
    // const geoPoint = new Parse.GeoPoint({
    //   latitude: params.geoPoint.lat,
    //   longitude: params.geoPoint.lng
    // });
    // place.set('geo', geoPoint);

    // 라벨과 이름을 업데이트한다.
    place.set('title', params.Place.title);
    place.set('label', params.Place.label);

    // 최종적으로 저장할때 템프 아이디를 삭제하고 레드북아이디를 설정한다.
    if( params.finalSaving ){
      place.set('note', note);
      place.set('redBookId', params.Place.redBookId);
      place.set('tempId', null);  
    } 
    
    return place
    .save()
    .then(function(savedPlace){

      let placeObject = savedPlace.toJSON();
      clearObjectId(placeObject);

      return Object.assign({}, normalize(placeObject, schema));
    });
  },

  likeNote: function(schema, params){

    let note = new Note();
    note.id = params.noteId;

    const like = new Like();
    params.Like.note = note;

    // 1. 일단 좋아요를 서버에 저장해!      
    return like
    .save(params.Like)
    .then(function(result){

      // debugger;

      // // 댓글에서 필요한 것만 뽑아내자!
      // const author = result.get('author');
      // const data = {
      //   id: result.id,
      //   author: {
      //     id: author.id,
      //     username: author.get('username'),
      //     picture: author.get('picture'),
      //     facebookId: author.get('facebookId')
      //   },
      //   text: result.get('text'),
      //   createdAt: result.get('createdAt')
      // }

      return Object.assign({}, normalize(data, schema));

    }, function(error){
      return error.code + ', ' + error.message;
    })
    
  },

  deleteNote: function(schema, params){

    const noteQuery = new Parse.Query(Note);
    return noteQuery
    .get(params.noteId)
    .then(function(note){

      const promise = new Parse.Promise();

      note.destroy({

        success: function(){
          promise.resolve({
            noteId: params.noteId,
            redBookId: params.redBookId
          })
        },

        error: function(err){
          promise.reject(err)
        }

      });

      return promise;      

    }, function(error){
      return error.code + ', ' + error.message;
    });
    
  },

  updateNote: function(schema, params){

    let note = new Note();
    note.id = params.noteId;

    return note
    .save({content: params.newText, modifiedAt:new Date, places: params.places})
    .then(function(savedNote){

      let newNote = savedNote.toJSON();
      clearObjectId(newNote, 'author');

      return Object.assign({}, normalize(newNote, schema));
      
    }, function(error){
      return error.code + ', ' + error.message;
    })

  },

  deletePlace: function(schema, params){
    let place = new Place();
    place.id = params.placeId;

    return place
    .destroy()
    .then(function(deletedPlace){
      return {
        noteId : deletedPlace.get('note').id,
        placeId : deletedPlace.id
      }
    }, function err(error){
      console.log('그런거 없어!!')
      return error.code + ', ' + error.message;
    });
  },

  deleteComment: function(schema, params){
    
    let note = new Note();
    note.id = params.noteId;

    let query = new Parse.Query(Comment);

    // 1. 일단 댓글을 찾아서 지워!      
    return query
    .get(params.commentId) 
    .then(function(result){

      const promise = new Parse.Promise();

      result.destroy({

        success: function(){
          promise.resolve({
            noteId: result.get('parent').id,
            commentId: result.id
          })
        },

        error: function(err){
          promise.reject(err)
        }

      });

      return promise; 

    }, function(error){
      return error.code + ', ' + error.message;
    })
  },

  checkInHere: function(schema, params){

    let checkIn = new CheckIn();
    let geoPoint = new Parse.GeoPoint({
      latitude: params.geo.lat,
      longitude: params.geo.lng
    });
    let redBook = new RedBook();
    redBook.id  = params.redBookId;

    let user = Parse.User.current();
    user.set('currentCity', params.uname);
    user.save();

    checkIn.set('person', params.person);
    checkIn.set('city', redBook);
    checkIn.set('geo', geoPoint);

    return checkIn
    .save()
    .then(function(saved){

      let savedJSON = saved.toJSON();
      savedJSON.id = saved.id;
      delete savedJSON.objectId;

      return savedJSON;
      
    }, function(error){
      return error.code + ', ' + error.message;
    })
    
  },

  checkOutHere: function(schema, params){

    let user = params.person;
    user.set('currentCity', '');
    
    return user
    .save()
    .then(function(user){

      return 'OK' 

    }, function(error){
      return error.code + ', ' + error.message;
    });
    
  },

  leaveUser: function(schema, params){
    let user = new Parse.User();
    user.id = params.userId;

    return user
    .destroy()
    .then(function(deleteUser){
      return {
        userId : deleteUser.id,
      }
    }); 
  }

}



export const PARSE = Symbol('Parse.com')
export default store => next => action => {

  /**
   * 페이스북 로그인 예외처리 
   * 본래 페북 로그인을 액션에서 처리하면 안되는데 딱히 넣을데가 없어서 
   * 일단 Action에서 처함. 액션이 호출되면 미들웨어는 자동 호출되므로,..
   * 여기에 페북 로그인인 경우엔 action 이 없다! 
   */ 
  if( !action ) {
    return;
  }

  const parseObject = action[PARSE]

  // Parse.com 으로 호출하는 API만 미들웨어가 처리한다. 
  if (typeof parseObject === 'undefined') {
    return next(action)
  }

  const { schema, types, method, params=null } = parseObject
  const [ requestType, successType, failureType ] = types

  if (!schema) {
    throw new Error('필요한 스카마(Schema)가 없습니다.')
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[PARSE]
    return finalAction
  }

  // 요청 액션을 실행하고
  next(actionWith({ type: requestType }))

  // For Debugging
  if( requestType === 'REDBOOKS_REQUEST') {
    //return;
  }

  // 성공과 실패에 대한 응답은 Promise 패턴으로 처리한다. 
  return parseAPI[method](schema, params).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error || 'Something bad happened'
    }))
  )
}