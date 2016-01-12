import { Schema, arrayOf, normalize } from 'normalizr'
import { camelizeKeys } from 'humps'

const redBookSchema = new Schema('redBooks', { idAttribute: 'id' })
const noteSchema = new Schema('notes', {  idAttribute: 'id'})
const commentSchema = new Schema('comments', {idAttribute: 'id'})
const resultSchema = new Schema('findings', {  idAttribute: 'id'})

export const Schemas = {
  REDBOOK: redBookSchema,
  REDBOOK_ARRAY: arrayOf(redBookSchema),
  NOTE: noteSchema,
  NOTE_ARRAY: arrayOf(noteSchema),
  COMMENT: commentSchema,
  RESULT: resultSchema,
  RESULT_ARRAY: arrayOf(resultSchema),
}

const RedBook = Parse.Object.extend('RedBook');
const Note = Parse.Object.extend('Note');
const Comment = Parse.Object.extend('Comment');

function clearObjectId(obj, key){
  obj.id = obj.objectId;
  delete obj.objectId;

  if( key ){
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
  fetchRedBook: function (schema) {

    let query = new Parse.Query(RedBook);

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

  fetchNote: function (schema, params) {

    let noteQuery = new Parse.Query(Note);
    let commentQuery = new Parse.Query(Comment);
    let redBook = new RedBook();

    redBook.id = params.redBookId;

    noteQuery.equalTo('redBook', redBook);
    noteQuery.descending('createdAt')

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

  addRedBook: function(schema, params){

    const redBook = new RedBook();
    const note    = new Note();

    return redBook
    .save(params.RedBook)
    .then(function(book){

      params.Note.redBook = book;
      note.save(params.Note);

      let newbook = book.toJSON();

      clearObjectId(newbook, 'creator');

      return Object.assign({}, normalize(newbook, schema));
    }, function(error){
      return error.code + ', ' + error.message;
    })
  }, 

  addNote: function(schema, params){

    const note    = new Note();
    const redBook = new RedBook();
    redBook.id = params.redBookId;
    params.Note.redBook = redBook;
    
    return note
    .save(params.Note)
    .then(function(redBookNote){

      let newNote = redBookNote.toJSON();
      clearObjectId(newNote, 'author');

      return Object.assign({}, normalize(newNote, schema));

    }, function(error){
      return error.code + ', ' + error.message;
    })
  },

  addComment: function(schema, params, next, actionWith, successType, failureType){

    let note = new Note();
    note.id = params.noteId;

    const comment = new Comment();
    params.Comment.parent = note;

    // 1. 일단 댓글을 서버에 저장해!      
    return comment
    .save(params.Comment)
    .then(function(){

      // 2. 그리고 해당 노트에 걸린 모든 댓글 찾아!
      const promise = new Parse.Promise();
      const commentQuery = new Parse.Query(Comment);
      commentQuery.equalTo('parent', note);
      
      commentQuery.find({
        success: function(comments){

          // 3. 모든 댓글을 모아서 노트의 comments로 저장한 뒤에 반환해! 
          comments.forEach( function(savedComment, i, a){
            let savedJsonComment = savedComment.toJSON();
            clearObjectId(savedJsonComment, 'author');
            delete savedJsonComment.parent;
            a[i] = savedJsonComment;
          });

          note.set('comments', comments);
          note
          .save()
          .then(function(){

            promise.resolve({
              comments: comments,
              noteId: params.noteId,
            });

          })
        }
      })

      return promise;
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

  deleteComment: function(schema, params){
    
    let note = new Note();
    note.id = params.noteId;

    let query = new Parse.Query(Comment);

    // 1. 일단 댓글을 찾아서 지워!      
    return query
    .get(params.commentId) 
    .then(function(comment){

      return comment
      .destroy()
      .then(function(){

        // 2. 그리고 노트에 걸린 모든 댓글 찾아!
        const promise = new Parse.Promise();
        const commentQuery = new Parse.Query(Comment);
        commentQuery.equalTo('parent', note);
        
        commentQuery.find({
          success: function(comments){

            // 3. 모든 댓글을 모아서 노트의 comments로 저장한 뒤에 반환해! 
            comments.forEach( function(savedComment, i, a){
              let savedJsonComment = savedComment.toJSON();
              clearObjectId(savedJsonComment, 'author');
              delete savedJsonComment.parent;
              a[i] = savedJsonComment;
            });

            note.set('comments', comments);
            note
            .save()
            .then(function(){

              promise.resolve({
                comments: comments,
                noteId: params.noteId,
              });

            })
          }
        })

        return promise;

      })

    }, function(error){
      return error.code + ', ' + error.message;
    })


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
  if( requestType === 'DELETE_COMMENT_REQUEST') {
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