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


export function facebookLogin(callback){

  Parse.FacebookUtils.logIn('email', {
    success: function(parseUser){

      // 로그아웃후 새로 로그인하면 페북에 있는 정보를 새로 가져온다.
      FB.api('/me?fields=id,name,email,picture{url}', function success(facebookUser){

        let updatingUser = {
          facebookId: facebookUser.id,
          picture: facebookUser.picture.data.url,
          updatedAt: new Date()
        }

        // 최초 이름 없으면 업데이트
        if( !parseUser.get('facebookId') && facebookUser.name ){
          updatingUser.username = facebookUser.name;
        }

        // 최초 이메일이 없으면 업데이트
        if( !parseUser.get('email') && facebookUser.email ){
          updatingUser.email = facebookUser.email;
        }

        parseUser.save(updatingUser);
        callback({success: {parseUser:parseUser}});


      }, function error(facebookUser){

        if( facebookUser.error ) {
          return callback({error:facebookUser.error});
        } 

        let updatingUser = {
          facebookId: facebookUser.id,
          picture: facebookUser.picture.data.url,
          updatedAt: new Date()
        }

        // 최초 이름 없으면 업데이트
        if( !parseUser.get('facebookId') && facebookUser.name ){
          updatingUser.username = facebookUser.name;
        }

        // 최초 이메일이 없으면 업데이트
        if( !parseUser.get('email') && facebookUser.email ){
          updatingUser.email = facebookUser.email;
        }

        parseUser.save(updatingUser);
        callback({success: {parseUser:parseUser}});        

      });

    }.bind(this),
    error: function(err){

      callback({error:err});

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
export function logOutUser(){
  
  return (dispatch, getState) => {
    return dispatch({
      type: 'CLEAR_LOGIN_USER_INFO'
    });
  };
}
/* END OF logOutUser */


/**
 * 회원 탈퇴 
 */
export function leaveUser(){
  
  return (dispatch, getState) => {
    return dispatch(function() {
      return {
        [PARSE]: {
          method: 'leaveUser',
          types: [ 'LEAVE_USER_REQUEST', 'LEAVE_USER_SUCCESS', 'LEAVE_USER_FAILURE' ],
          params: { userId: Parse.User.current().id },
          schema: 'NONE'
        }
      }
    }())
  }
}
/* END OF leaveUser */



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
 * 데이터 변경 사항을 저장한다. 
 */
export function updateRedBookState(data){
  return (dispatch, getState) => {
    return dispatch({
      type: 'UPDATE_REDBOOK_STATE',
      data: data
    });
  }
}
/* END OF setNewRedBookCityName */

/**
 * 데이터 변경 사항을 저장한다. 
 */
export function updateNoteState(data){
  return (dispatch, getState) => {
    return dispatch({
      type: 'UPDATE_NOTE_STATE',
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

    let { redBookState } = getState();
    redBookState.creator = Parse.User.current();
    redBookState.notes = [];

    return dispatch(function(){
      return {
        [PARSE]: {
          method: 'addRedBook',
          params: {
            'RedBook': redBookState,
            'Note': {
              comments: [],
              places: [],
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
export const NOTE_REQUEST = 'NOTE_REQUEST'
export const NOTE_SUCCESS = 'NOTE_SUCCESS'
export const NOTE_FAILURE = 'NOTE_FAILURE'
export function fetchNote (noteId) {

  return (dispatch, getState) => {
    return dispatch(function(){
      return {
        noteId,
        [PARSE]: {
          method: 'fetchNote',
          params: { 
            noteId : noteId
          },
          types: [ NOTE_REQUEST, NOTE_SUCCESS, NOTE_FAILURE ],
          schema: Schemas.NOTE
        }
      }
    }())
  }
}


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
export function addNote (redBookId, noteText, placeIds, places){

  return (dispatch, getState) => {
    return dispatch(function(){
      return {
        redBookId,
        [PARSE]: {
          method: 'addNote',
          params: {
            Note: {
              places: placeIds,
              comments: [],
              content: noteText,
              author: Parse.User.current()
            },
            Place: places,
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


/**
 *  노트를 수정한다.
 */ 
export const UPDATE_NOTE_REQUEST = 'UPDATE_NOTE_REQUEST'
export const UPDATE_NOTE_SUCCESS = 'UPDATE_NOTE_SUCCESS'
export const UPDATE_NOTE_FAILURE = 'UPDATE_NOTE_FAILURE'
export function updateNote (redBookId, noteId, newText, placeIds) {
  return (dispatch, getState) => {
    return dispatch(function(){
      return {
        redBookId,
        noteId,
        [PARSE]: {
          method: 'updateNote',
          params: {
            redBookId: redBookId,
            noteId: noteId,
            newText: newText,
            places: placeIds
          },
          types: [ UPDATE_NOTE_REQUEST, UPDATE_NOTE_SUCCESS, UPDATE_NOTE_FAILURE ],
          schema: Schemas.NOTE
        }
      }
    }());
  }
}
/* END OF deleteNote */

export function resetUpdateNote (){

  return (dispatch, getState) => {
    return dispatch({
      type: 'RESET_UPDATE_NOTE'
    });
  };
}

export function resetAddNote (){
  return (dispatch, getState) => {
    return dispatch({
      type: 'RESET_ADD_NOTE'
    });
  };
}



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


// 장소를 불러온다. 
export const PLACES_REQUEST = 'PLACES_REQUEST'
export const PLACES_SUCCESS = 'PLACES_SUCCESS'
export const PLACES_FAILURE = 'PLACES_FAILURE'
export function fetchPlaces (params) {

  return (dispatch, getState) => {
    return dispatch(function(){
      return {
        redBookId:params.redBookId,
        [PARSE]: {
          method: 'fetchPlaces',
          params: params,
          types: [ PLACES_REQUEST, PLACES_SUCCESS, PLACES_FAILURE ],
          schema: Schemas.PLACE_ARRAY
        }
      }
    }())
  }
}

/**
 *  노트에 위치를 추가한다.
 */ 
export const ADD_PLACE_REQUEST = 'ADD_PLACE_REQUEST'
export const ADD_PLACE_SUCCESS = 'ADD_PLACE_SUCCESS'
export const ADD_PLACE_FAILURE = 'ADD_PLACE_FAILURE'
export function addPlace (markerKey, userId, noteId, title, label, geo) {
  return (dispatch, getState) => {
    return dispatch(function(){
      return {
        [PARSE]: {
          method: 'addPlace',
          params: {
            Place: {
              redBookId: markerKey+'',
              userId: userId,
              title: title,
              label: label,
              noteId: noteId
            },
            geoPoint: geo
          },
          types: [ ADD_PLACE_REQUEST, ADD_PLACE_SUCCESS, ADD_PLACE_FAILURE ],
          schema: Schemas.PLACE
        }
      }
    }());
  }
}
/* END OF addNoteComment */

/**
 *  노트에 위치를 추가한다.
 */ 
export const UPDATE_PLACE_REQUEST = 'UPDATE_PLACE_REQUEST'
export const UPDATE_PLACE_SUCCESS = 'UPDATE_PLACE_SUCCESS'
export const UPDATE_PLACE_FAILURE = 'UPDATE_PLACE_FAILURE'
export function updatePlace (redBookId, noteId, place) {
  return (dispatch, getState) => {
    return dispatch(function(){
      return {
        [PARSE]: {
          method: 'updatePlace',
          params: {
            Place: {
              redBookId: redBookId,
              title: place.title,
              label: place.label
            },
            placeId: place.key,
            noteId: noteId,
            geoPoint: place.position
          },
          types: [ UPDATE_PLACE_REQUEST, UPDATE_PLACE_SUCCESS, UPDATE_PLACE_FAILURE ],
          schema: Schemas.PLACE
        }
      }
    }());
  }
}
/* END OF addNoteComment */

/**
 *  노트에 위치를 삭제한다.
 */ 
export const DELETE_PLACE_REQUEST = 'DELETE_PLACE_REQUEST'
export const DELETE_PLACE_SUCCESS = 'DELETE_PLACE_SUCCESS'
export const DELETE_PLACE_FAILURE = 'DELETE_PLACE_FAILURE'
export function deletePlace (placeId) {
  return (dispatch, getState) => {
    return dispatch(function(){
      return {
        [PARSE]: {
          method: 'deletePlace',
          params: {
            placeId: placeId,
          },
          types: [ DELETE_PLACE_REQUEST, DELETE_PLACE_SUCCESS, DELETE_PLACE_FAILURE ],
          schema: Schemas.PLACE
        }
      }
    }());
  }
}
/* END OF addNoteComment */




/**
 *  노트에 커맨트를 추가한다.
 */ 
export const LIKE_NOTE_REQUEST = 'LIKE_NOTE_REQUEST'
export const LIKE_NOTE_SUCCESS = 'LIKE_NOTE_SUCCESS'
export const LIKE_NOTE_FAILURE = 'LIKE_NOTE_FAILURE'
export function likeNote (noteId) {
  return (dispatch, getState) => {
    return dispatch(function(){
      return {
        noteId,
        [PARSE]: {
          method: 'likeNote',
          params: {
            Like: {
              user: Parse.User.current()
            }, 
            noteId: noteId
          },
          types: [ LIKE_NOTE_REQUEST, LIKE_NOTE_SUCCESS, LIKE_NOTE_FAILURE ],
          schema: Schemas.LIKE
        }
      }
    }());
  }
}
/* END OF addNoteComment */

