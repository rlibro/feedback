import * as ActionTypes from '../actions'
import merge from 'lodash/object/merge'
import paginate from './paginate'
import { routeReducer, UPDATE_PATH} from 'redux-simple-router'
import { combineReducers } from 'redux'

// API 응답은 캐시를 위해 모두 entities에 저장한다. 
function entities(state = { redBooks: {}, notes:{} }, action) {
  
  if (action.response && action.response.entities) {

    const {entities, result} = action.response;

    switch(action.type){

      // 새로 생성한 댓글은 해당 노트의 댓글목록에 추가한다.
      case ActionTypes.ADD_COMMENT_SUCCESS:
        const comment = entities.comments[result];
        const note = state.notes[comment.noteId];
        delete comment.noteId;
        note.comments.push(comment);

        return merge({}, state)

      // 새로 생성된 노트는 기존 노트 목록에 추가한다.
      case ActionTypes.ADD_NOTE_SUCCESS:
        state.notes[result] = entities.notes[result];
        state.redBooks[action.redBookUname].noteCount++;

        return merge({}, state)


      // 나머지는 모두 새로운 entities를 만들어 저장한다.
      default: 
        return merge({}, state, action.response.entities)

    }
  }

  return state
}

// Updates error message to notify about the failed fetches.
function errorMessage(state = null, action) {
  const { type, error } = action

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return action.error
  }

  return state
}

// Updates the pagination data for different actions.
const pagination = combineReducers({
  
  redBooks: paginate({
    mapActionToKey: action => null,
    types: [
      ActionTypes.REDBOOKS_REQUEST,
      ActionTypes.REDBOOKS_SUCCESS,
      ActionTypes.REDBOOKS_FAILURE
    ]
  }),
  notesByRedBookId: paginate({
    mapActionToKey: action => action.redBookId,
    types: [
      ActionTypes.NOTES_REQUEST,
      ActionTypes.NOTES_SUCCESS,
      ActionTypes.NOTES_FAILURE
    ]
  })

})

// 로그인 리듀서
function login(state = {}, action) {
  // if (action.response && action.response.entities) {
  //   return merge({}, state, action.response.entities)
  // }

  if( action.type === 'UPDATE_CURRENT_USER_LOCATION' ) {
    state.current_location = action.current_location;
    return merge({}, state)
  }

  return state
}

function finding(state = {}, action) {
  // console.log( 'FFF ==> ', action,  state)

  // if (action.response && action.response.entities) {
    
  //   return merge({}, state, action.response.entities)
  // }
  return state
}

function newRedBook(state = {}, action) {


  if( action.type === 'SET_NEW_RED_BOOK_CITY_NAME') {
   
    state.cityName = action.cityName;

    return merge({}, state);
  }
  
  return state
}

/**
 * 데이터 스토어에 들어갈 기본 구조
 * country - 나라 목록 (페이징 구조, 기본은 Top10만 가져오기)
 * redbook = {
     nearby : { ids:[] }
   }
 */
const rootReducer = combineReducers({
  entities,
  pagination,
  errorMessage,
  login,
  finding,
  newRedBook,
  routing: routeReducer
})

export default rootReducer