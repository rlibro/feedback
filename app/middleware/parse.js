import { Schema, arrayOf, normalize } from 'normalizr'
import { camelizeKeys } from 'humps'
import _ from 'lodash'

const userSchema = new Schema('users', { idAttribute: 'id' })
const redBookSchema = new Schema('redBooks', { idAttribute: 'id' })
const noteSchema = new Schema('notes', {  idAttribute: 'id'})
const commentSchema = new Schema('comments', {idAttribute: 'id'})
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
    query.ascending('cityName');

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
    let note = new Note();

    note.id = params.noteId;

    placeQuery.equalTo('note', note);
    
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

  addNote: function(schema, params){

    const note    = new Note();
    const redBook = new RedBook();
    redBook.id = params.redBookId;
    params.Note.redBook = redBook;
    
    return note
    .save(params.Note)
    .then(function(savedNote){

      var promises = [];
      _.each(params.Place, function(placeParam){

        const geoPoint = new Parse.GeoPoint({
          latitude: placeParam.position.lat(),
          longitude: placeParam.position.lng()
        });

        const place = new Place();
        place.set('note', savedNote);
        place.set('title', placeParam.title);
        place.set('label', placeParam.label);
        place.set('geo', geoPoint);

        promises.push(place.save());

      });

      return Parse.Promise.when(promises)
      .then(function(){

        let places = [];
        _.each( arguments, function(p){
          places.push(p.id);
        });

        savedNote.save({
          places: places
        });
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
    .save({content: params.newText})
    .then(function(redBookNote){

      let newNote = redBookNote.toJSON();
      clearObjectId(newNote, 'author');

      return Object.assign({}, normalize(newNote, schema));

    }, function(error){
      return error.code + ', ' + error.message;
    })

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
  if( requestType === 'ADD_NOTE_REQUEST') {
  //  return;
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