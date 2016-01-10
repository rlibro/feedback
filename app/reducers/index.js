import * as ActionTypes from '../actions'
import merge from 'lodash/object/merge'
import paginate from './paginate'
import { pushPath as pushState, routeReducer } from 'redux-simple-router'
import { combineReducers } from 'redux'

// API 응답은 캐시를 위해 모두 entities에 저장한다. 
function entities(state = { redBooks: {}, notes:{} }, action) {
  
  if (action.response && action.response.entities) {

    const {entities, result} = action.response;

    switch(action.type){

      // 새로 생성된 노트는 기존 노트 목록에 추가한다.
      case ActionTypes.ADD_NOTE_SUCCESS:
        state.notes[result] = entities.notes[result];

        return merge({}, state)


      // 나머지는 모두 새로운 entities를 만들어 저장한다.
      default: 
        return merge({}, state, action.response.entities)

    }
  }

  if( action.response && action.type === 'ADD_COMMENT_SUCCESS'){

    const { comments, noteId } = action.response;
    const notes = state.notes[noteId];
    notes.comments = comments;
    
    return merge({}, state);

  }

  if( action.response && action.type === 'DELETE_NOTE_SUCCESS') {

    for (let i=0; i < state.notes.length; ++i){
      
      if( state.notes[i] === action.noteId ){
        this.state.notes.splice(i, 1);
        break;
      }
    }

    return merge({}, state);   
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

  if( action.type === 'UPDATE_LOGIN_USER') {
    return merge({}, action.login)
  }

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

  switch(action.type){

    case 'UPDATE_DATA_FOR_NEW_BOOK':
      if( !action.data ) {
        return null;
      }

      return merge({}, state, action.data);
  }
  
  return state
}

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