import { PARSE, Schemas } from '../middleware/parse'

export function resetErrorMessage(){
  return (dispatch, getState) => {
    return dispatch({
      type: 'RESET_ERROR_MESSAGE'
    });
  }
}

// 이도시에 있는 사람을 불러온다. 
export const CITY_PEOPLES_REQUEST = 'CITY_PEOPLES_REQUEST'
export const CITY_PEOPLES_SUCCESS = 'CITY_PEOPLES_SUCCESS'
export const CITY_PEOPLES_FAILURE = 'CITY_PEOPLES_FAILURE'
export function fetchCityPeoples(uname) {
  return (dispatch, getState) => {
    return dispatch(function() {
      return {
        uname,
        [PARSE]: {
          method: 'fetchCityPeoples',
          types: [ CITY_PEOPLES_REQUEST, CITY_PEOPLES_SUCCESS, CITY_PEOPLES_FAILURE ],
          schema: Schemas.USER_ARRAY,
          params: {
            uname: uname
          }
        }
      }
    }())
  }
}

export const CHECKIN_REQUEST = 'CHECKIN_REQUEST'
export const CHECKIN_SUCCESS = 'CHECKIN_SUCCESS'
export const CHECKIN_FAILURE = 'CHECKIN_FAILURE'
export function checkInHere( redBookId, uname, latlng ){
  return (dispatch, getState) => {
    return dispatch(function() {
      return {
        uname: uname,
        userId: Parse.User.current().id,
        [PARSE]: {
          method: 'checkInHere',
          types: [ CHECKIN_REQUEST, CHECKIN_SUCCESS, CHECKIN_FAILURE ],
          params: {
            redBookId: redBookId,
            uname: uname,
            person: Parse.User.current(),
            geo: latlng
          },
          schema: 'NONE'
        }
      }
    }())
  }
}

export const CHECKOUT_REQUEST = 'CHECKOUT_REQUEST'
export const CHECKOUT_SUCCESS = 'CHECKOUT_SUCCESS'
export const CHECKOUT_FAILURE = 'CHECKOUT_FAILURE'
export function checkOutHere( uname ){
  return (dispatch, getState) => {
    return dispatch(function() {
      return {
        uname: uname,
        userId: Parse.User.current().id,
        [PARSE]: {
          method: 'checkOutHere',
          types: [ CHECKOUT_REQUEST, CHECKOUT_SUCCESS, CHECKOUT_FAILURE ],
          params: {
            person: Parse.User.current()
          },
          schema: 'NONE'
        }
      }
    }())
  }
}


export function facebookLogin(update){

  Parse.FacebookUtils.logIn('user_location,user_friends,email', {
    success: function(parseUser){

      if( !parseUser.get('location') ) {

        FB.api('/me?fields=id,name,email,location,picture{url}', function(facebookUser) {


          //console.log('facebook 에서 로그인 정보 가져옴!', facebookUser);

          FB.api(`/${facebookUser.location.id}/?fields=location`, function(res){

            //console.log('facebook 에서 위치 정보 가져옴!', facebookUser);

            facebookUser.location = res.location;
            
            parseUser.save({
              facebookId: facebookUser.id,
              username: facebookUser.name,
              //email: facebookUser.email,
              location: facebookUser.location,
              picture: facebookUser.picture.data.url
            });

            update(parseUser.toJSON());

          })

        });

      } else {
        update(parseUser.toJSON());
      }

    }.bind(this),
    error: function(err){
      console.log('이 에러가 발생하면 로그인 시도할때 Parse로 호출이 안되는걸껄?', err);
    }
  });

}

/**
 * 페이스북 로그인 정보를 저장한다. 
 */
export function updateLoginUserInfo(userInfo, curLoc){

  if( userInfo.objectId ){
    userInfo.id = userInfo.objectId;
    delete userInfo.objectId;
    delete userInfo.sessionToken;
    delete userInfo.type;
    delete userInfo.className;
    delete userInfo.authData;
    delete userInfo.createdAt;
    delete userInfo.updatedAt;
  }

  return (dispatch, getState) => {
    return dispatch({
      type: 'UPDATE_LOGIN_USER_INFO',
      login: userInfo
    });
  };
}
/* END OF setNewRedBookCityName */


/**
 * 로그아웃한다. 
 */
export function logOutUser(userInfo){
  
  return (dispatch, getState) => {
    return dispatch({
      type: 'CLEAR_LOGIN_USER_INFO',
      login: userInfo
    });
  };
}
/* END OF logOutUser */


/**
 * 사용자의 현재 위치를 로그인 정보에 업데이트 한다.
 */
 export function updateCurrentUserLocation(location){
  return (dispatch, getState) => {
    return dispatch({
      type: 'UPDATE_CURRENT_USER_LOCATION',
      current_location: location
    });
  }
 }
/* END OF updateCurrentUserLocation */

/**
 * 키워드 검색후 검색어를 저장한다. 
 */
export const FIND_KEYWORD_REQUEST = 'FIND_KEYWORD_REQUEST'
export const FIND_KEYWORD_SUCCESS = 'FIND_KEYWORD_SUCCESS'
export const FIND_KEYWORD_FAILURE = 'FIND_KEYWORD_FAILURE'

function findKeyWord(keyword){
  return {
    [CALL_API]: {
      types: [ FIND_KEYWORD_REQUEST, FIND_KEYWORD_SUCCESS, FIND_KEYWORD_FAILURE ],
      endpoint: `/find?q=${keyword}`,
      schema: Schemas.RESULT_ARRAY
    }
  } 
}
export function findingKeyWord(keyword) {
  return (dispatch, getState) => {
    return dispatch(findKeyWord(keyword));
  }
}
/* END OF findingKeyWord */



/**
 * 데이터 변경 사항을 저장한다. 
 */
export function updateDataForNewRedBook(data){
  return (dispatch, getState) => {
    return dispatch({
      type: 'UPDATE_DATA_FOR_NEW_BOOK',
      data: data
    });
  }
}
/* END OF setNewRedBookCityName */


/**
 * 사이드바 정보 업데이트. 
 */
export function updateAppState(state){
  
  return (dispatch, getState) => {
    return dispatch({
      type: 'UPDATE_APP_STATE',
      state: state
    });
  };
}
/* END OF logOutUser */



// 레드북을 불러온다. 
export const REDBOOKS_REQUEST = 'REDBOOKS_REQUEST'
export const REDBOOKS_SUCCESS = 'REDBOOKS_SUCCESS'
export const REDBOOKS_FAILURE = 'REDBOOKS_FAILURE'
export function fetchRedBooks() {
  return (dispatch, getState) => {
    return dispatch(function() {
      return {
        [PARSE]: {
          method: 'fetchRedBooks',
          types: [ REDBOOKS_REQUEST, REDBOOKS_SUCCESS, REDBOOKS_FAILURE ],
          schema: Schemas.REDBOOK_ARRAY
        }
      }
    }())
  }
}

/**
 * 새로운 레드북을 만든다. 
 */
export const ADD_REDBOOK_REQUEST = 'ADD_REDBOOK_REQUEST'
export const ADD_REDBOOK_SUCCESS = 'ADD_REDBOOK_SUCCESS'
export const ADD_REDBOOK_FAILURE = 'ADD_REDBOOK_FAILURE'
export function addRedBook(noteText){
  
  return (dispatch, getState) => {

    let { pageForNewRedBook } = getState();
    pageForNewRedBook.creator = Parse.User.current();
    pageForNewRedBook.notes = [];

    return dispatch(function(){
      return {
        [PARSE]: {
          method: 'addRedBook',
          params: {
            'RedBook': pageForNewRedBook,
            'Note': {
              comments: [],
              content: noteText,
              author: Parse.User.current()
            }
          },
          types: [ ADD_REDBOOK_REQUEST, ADD_REDBOOK_SUCCESS, ADD_REDBOOK_FAILURE ],
          schema: Schemas.REDBOOK
        }
      }
    }())
  }
}
/* END OF addRedBook */


// 노트를 불러온다. 
export const NOTES_REQUEST = 'NOTES_REQUEST'
export const NOTES_SUCCESS = 'NOTES_SUCCESS'
export const NOTES_FAILURE = 'NOTES_FAILURE'
export function fetchNotes (redBookId) {

  return (dispatch, getState) => {
    return dispatch(function(){
      return {
        redBookId,
        [PARSE]: {
          method: 'fetchNotes',
          params: { 
            redBookId : redBookId
          },
          types: [ NOTES_REQUEST, NOTES_SUCCESS, NOTES_FAILURE ],
          schema: Schemas.NOTE_ARRAY
        }
      }
    }())
  }
}

/**
 * 레드북에 노트를 추가한다. 
 */
export const ADD_NOTE_REQUEST = 'ADD_NOTE_REQUEST'
export const ADD_NOTE_SUCCESS = 'ADD_NOTE_SUCCESS'
export const ADD_NOTE_FAILURE = 'ADD_NOTE_FAILURE'
export function addNote (redBookId, noteText){

  return (dispatch, getState) => {
    return dispatch(function(){
      return {
        redBookId,
        [PARSE]: {
          method: 'addNote',
          params: {
            Note: {
              comments: [],
              content: noteText,
              author: Parse.User.current()
            },
            redBookId: redBookId 
          },
          types: [ ADD_NOTE_REQUEST, ADD_NOTE_SUCCESS, ADD_NOTE_FAILURE ],
          schema: Schemas.NOTE
        }
      }
    }());
  } 
}
/* END OF addRedBookNote */

/**
 *  노트를 삭제한다.
 */ 
export const DELETE_NOTE_REQUEST = 'DELETE_NOTE_REQUEST'
export const DELETE_NOTE_SUCCESS = 'DELETE_NOTE_SUCCESS'
export const DELETE_NOTE_FAILURE = 'DELETE_NOTE_FAILURE'
export function deleteNote (noteId, redBookId) {
  return (dispatch, getState) => {
    return dispatch(function(){
      return {
        [PARSE]: {
          method: 'deleteNote',
          params: {
            noteId: noteId,
            redBookId: redBookId
          },
          types: [ DELETE_NOTE_REQUEST, DELETE_NOTE_SUCCESS, DELETE_NOTE_FAILURE ],
          schema: Schemas.NOTE
        }
      }
    }());
  }
}
/* END OF deleteNote */




// 댓글을 불러온다. 
export const COMMENTS_REQUEST = 'COMMENTS_REQUEST'
export const COMMENTS_SUCCESS = 'COMMENTS_SUCCESS'
export const COMMENTS_FAILURE = 'COMMENTS_FAILURE'
export function fetchComments (noteId) {

  return (dispatch, getState) => {
    return dispatch(function(){
      return {
        noteId,
        [PARSE]: {
          method: 'fetchComments',
          params: { 
            noteId : noteId
          },
          types: [ COMMENTS_REQUEST, COMMENTS_SUCCESS, COMMENTS_FAILURE ],
          schema: Schemas.COMMENT_ARRAY
        }
      }
    }())
  }
}

/**
 *  노트에 커맨트를 추가한다.
 */ 
export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST'
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS'
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE'
export function addComment (noteId, commentText) {
  return (dispatch, getState) => {
    return dispatch(function(){
      return {
        noteId,
        [PARSE]: {
          method: 'addComment',
          params: {
            Comment: {
              text: commentText,
              author: Parse.User.current()
            }, 
            noteId: noteId
          },
          types: [ ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE ],
          schema: Schemas.COMMENT
        }
      }
    }());
  }
}
/* END OF addNoteComment */

/**
 *  댓글을 삭제한다.
 */ 
export const DELETE_COMMENT_REQUEST = 'DELETE_COMMENT_REQUEST'
export const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS'
export const DELETE_COMMENT_FAILURE = 'DELETE_COMMENT_FAILURE'
export function deleteComment (commentId, noteId) {
  return (dispatch, getState) => {
    return dispatch(function(){
      return {
        [PARSE]: {
          method: 'deleteComment',
          params: {
            commentId: commentId,
            noteId: noteId
          },
          types: [ DELETE_COMMENT_REQUEST, DELETE_COMMENT_SUCCESS, DELETE_COMMENT_FAILURE ],
          schema: Schemas.COMMENT
        }
      }
    }());
  }
}
/* END OF deleteComment */