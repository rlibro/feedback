import * as ActionTypes from '../actions'
import merge from 'lodash/object/merge'
import paginate from './paginate'
import { pushPath as pushState, routeReducer } from 'redux-simple-router'
import { combineReducers } from 'redux'

// API 응답은 캐시를 위해 모두 entities에 저장한다. 
function entities(state = { redBooks: {}, notes:{}, comments:{} }, action) {
  
  if (action.response && action.response.entities) {

    const {entities, result} = action.response;

    switch(action.type){

      // 새로 생성된 노트는 기존 노트 목록에 추가한다.
      case ActionTypes.ADD_NOTE_SUCCESS:
        state.notes[result] = entities.notes[result];

        return merge({}, state)

      // 댓글이 추가 되면 노트의 댓글 목록에 아이디를 추가하고 엔터티에 저장한다.
      case ActionTypes.ADD_COMMENT_SUCCESS: 
        state.notes[action.noteId].comments.push(result);

      // 나머지는 모두 새로운 entities를 만들어 저장한다.
      default: 
        return merge({}, state, action.response.entities)

    }
  }

  if( action.response && (action.type === 'DELETE_COMMENT_SUCCESS')){

    const { commentId, noteId } = action.response;
    let comments = state.notes[noteId].comments
    let i=0;

    for (; i< comments.length; ++i){
      if( comments[i] === commentId ){
        comments.splice(i,1);
        break;
      }
    }

    state.comments[commentId] = null;
    delete state.comments[commentId]

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

  if (type === 'RESET_ERROR_MESSAGE') {
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
  
  if( action.type === 'UPDATE_LOGIN_USER_INFO') {
    if( action.login.facebook ){
      state.facebook = action.login.facebook;
    } else {
      action.login.facebook = state.facebook ? 'LOADED': false;
      state = action.login;
    }

    return merge({}, state)
  }

  if( action.type === 'CLEAR_LOGIN_USER_INFO') {

    if( state.facebook === 'LOADED') {
      state = {
        facebook: true
      }
    } else {
      state = {
        facebook: false
      }
    }

    return merge({}, state)
  }

  if( action.type === 'UPDATE_CURRENT_USER_LOCATION' ) {
    state.current_location = action.current_location;
    return merge({}, state)
  }

  return state
}

function appState(state = {sidebar: false}, action) {

  switch(action.type){

    case 'UPDATE_APP_STATE':
      
      return merge({}, state, action.state);
  }
  

  return state
}

function pageForNewRedBook(state = {}, action) {

  switch(action.type){

    case 'UPDATE_DATA_FOR_NEW_BOOK':
      if( !action.data ) {
        return null;
      }

      return merge({}, state, action.data);
  }
  
  return state
}

function pageForRedBook(state = {
  stateLoaded: 'READY', 
  stateAddComment:'READY',
  stateDeleteComment:'READY',
  count:0}, action) {

  // API 호출 응답을 먼저 받아야하기 때문에 응답 결과를 갖는 액션은 Skip 한다.
  if( action.entities ) {
    return;
  }

  switch(action.type){

    // 댓글 추가
    case 'ADD_COMMENT_REQUEST':
      state.stateAddComment = 'REQUESTING';
      return merge({}, state);

    case 'ADD_COMMENT_SUCCESS':
      state.stateAddComment = 'READY';
      return merge({}, state);

    case 'ADD_COMMENT_FAILURE':
      state.stateAddComment = 'FAIL';
      return merge({}, state);

    // 댓글 삭제 
    case 'DELETE_COMMENT_REQUEST':
      state.stateDeleteComment = 'REQUESTING';
      return merge({}, state);

    case 'DELETE_COMMENT_SUCCESS':
      state.stateDeleteComment = 'READY';
      return merge({}, state);

    case 'DELETE_COMMENT_FAILURE':
      state.stateDeleteComment = 'FAIL';
      return merge({}, state);


    // 레드북 패치
    case 'REDBOOKS_REQUEST':
      state.stateRedBook = 'REQUESTING'
      return merge({}, state);

    case 'REDBOOKS_SUCCESS':
      state.stateRedBook = 'LOADED'
      state.count = state.count + 1;

      return merge({}, state);

    case 'REDBOOKS_FAILURE':

      state.stateRedBook = 'FAIL'
      return merge({}, state);
  }
  
  return state
}

const rootReducer = combineReducers({
  entities,
  pagination,
  errorMessage,
  login,
  routing: routeReducer,
  appState,
  pageForNewRedBook,
  pageForRedBook
  
})

export default rootReducer