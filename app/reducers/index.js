import * as ActionTypes from '../actions'
import merge from 'lodash/merge'
import paginate from './paginate'
import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'

// API 응답은 캐시를 위해 모두 entities에 저장한다. 
function entities(state = { redBooks: {}, notes:{}, comments:{}, users:{}, places:{} }, action) {
  
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

      case ActionTypes.UPDATE_NOTE_SUCCESS: 
        state.notes[result] = entities.notes[result];

      // 나머지는 모두 새로운 entities를 만들어 저장한다.
      default: 
        return merge({}, state, action.response.entities)

    }
  }

  if( action.response && (action.type === 'DELETE_PLACE_SUCCESS')){

    const { notedId, placeId } = action.response;
    let i=0;
    for (; i< state.places.length; ++i){
      if( state.places[i] === placeId ){
        state.places.splice(i,1);
        break;
      }
    }

    state.places[placeId] = null;
    delete state.places[placeId]

    return merge({}, state);
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

  // 로그인한 유저정보도 기본으로 유저 목록에 넣어야한다.
  if( action.type === 'UPDATE_LOGIN_USER_INFO' && action.login.id ) {

    state.users[action.login.id] = action.login;
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
  }),
  placesByRedBookId: paginate({
    mapActionToKey: action => action.redBookId,
    types: [
      ActionTypes.PLACES_REQUEST,
      ActionTypes.PLACES_SUCCESS,
      ActionTypes.PLACES_FAILURE
    ]
  }),
  commentsByNoteId: paginate({
    mapActionToKey: action => action.noteId,
    types: [
      ActionTypes.COMMENTS_REQUEST,
      ActionTypes.COMMENTS_SUCCESS,
      ActionTypes.COMMENTS_FAILURE
    ]
  }),
  peoplesByUname: paginate({
    mapActionToKey: action => action.uname,
    types: [
      ActionTypes.CITY_PEOPLES_REQUEST,
      ActionTypes.CITY_PEOPLES_SUCCESS,
      ActionTypes.CITY_PEOPLES_FAILURE
    ]
  })



})

// 로그인 리듀서
function login(state = {}, action) {
  
  if( action.type === 'UPDATE_LOGIN_USER_INFO') {
    return merge({}, action.login)
  }

  if( action.type === 'CLEAR_LOGIN_USER_INFO') {
    return merge({current_location: state.current_location})
  }

  if( action.type === 'UPDATE_CURRENT_USER_LOCATION' ) {
    state.current_location = action.current_location;
    return merge({}, state)
  }

  if( action.type === 'CHECKIN_SUCCESS') {
    state.currentCity = action.response.city.uname;
    return merge({}, state)
  }

  if( action.type === 'CHECKOUT_SUCCESS') {
    state.currentCity = '';
    return merge({}, state)
  }

  return state
}

function appState(state = {
  loadedFacebookSDK: false,
  loadedGoogleSDK: false,
  sidebar: false,
  search: {
    result: [] 
  }
}, action) {

  switch(action.type){

    case 'UPDATE_APP_STATE':

      if( action.state.search ){
        state.search.result = [];
      }

      return merge({}, state, action.state);


    case 'SEARCH_REDBOOK_SUCCESS':
    case 'SEARCH_USER_SUCCESS':

      const {result, query, mode} = action.response;

      if( result && result.length ) {
        state.search.result = result;
        state.search.query = query;
        state.search.mode = mode;
      }
      
      return merge({}, state, action.state);
  }
  

  return state
}

function redBookState(state = { isFetching: { addRedBook: 'READY'} }, action) {

  switch(action.type){

    case 'UPDATE_REDBOOK_STATE':
      if( !action.data ) {
        return null;
      }

      return merge({}, state, action.data);


    // 레드북 추가
    case 'ADD_REDBOOK_REQUEST':
      state.isFetching.addRedBook = 'REQUESTING';
      return merge({}, state);

    case 'ADD_REDBOOK_SUCCESS':
    case 'ADD_REDBOOK_FAILURE':
      state.isFetching.addRedBook = 'DONE';
      return merge({}, state);

    case 'RESET_ADD_NOTE': 
      state.isFetching.addRedBook = 'READY';
      return merge({}, state);


  }
  
  return state
}

function noteState(state = {
  stateLoaded: 'READY', 
  stateAddComment:'READY',
  stateDeleteComment:'READY',
  stateNoteUpdate: 'READY',     // 요건 쓰는거임!
  places: [],
  isFetching: {
    redbooks: 'READY',
    note: false,
    comments: false,
    addNote: 'READY',
    place: false
  },
  isEditing: false,
  editingId: null,
  formText: '',
  openMap: false,
  count:0}, action) {

  // API 호출 응답을 먼저 받아야하기 때문에 응답 결과를 갖는 액션은 Skip 한다.
  if( action.entities ) {
    return;
  }

  switch(action.type){

    // 댓글
    case 'COMMENTS_REQUEST':
    state.isFetching.comments = true;
    return merge({}, state);

    case 'COMMENTS_SUCCESS':
    case 'COMMENTS_FAILURE':
    state.isFetching.comments = false;
    return merge({}, state);

    // 노트 한개 가져오기 
    case 'NOTE_REQUEST':
    state.isFetching.note = true;
    return merge({}, state);

    case 'NOTE_SUCCESS':
    case 'NOTE_FAILURE':
    state.isFetching.note = false;
    return merge({}, state);


    // 노트 추가
    case 'ADD_NOTE_REQUEST':
    state.isFetching.addNote = 'REQUESTING';
    return merge({}, state);

    case 'ADD_NOTE_SUCCESS':
    case 'ADD_NOTE_FAILURE':
    state.isFetching.addNote = 'DONE';
    return merge({}, state);
    case 'RESET_ADD_NOTE': 
    state.places = [];
    state.isFetching.addNote = 'READY';
    return merge({}, state);

    // 위치 추가
    case 'ADD_PLACE_SUCCESS':
    
    const {entities: {places}, result} = action.response;
    const place = places[result];
    let i=0;

    for(; i< state.places.length; ++i){
      if( state.places[i].key == place.redBookId ){
        state.places[i] = {
          canEdit: true,
          key: place.id,
          label: place.label,
          position: {
            lat: place.geo.latitude,
            lng: place.geo.longitude
          },
          title: place.title,
          isNew: true
        }
        return merge({}, state);
      }
    }

    // 레드북 패치
    case 'REDBOOKS_REQUEST':
      state.isFetching.redbooks = 'REQUESTING'
      return merge({}, state);
    case 'REDBOOKS_FAILURE':
    case 'REDBOOKS_SUCCESS':
      state.isFetching.redbooks = 'DONE'
      return merge({}, state);
    case 'RESET_REDBOOKS':        // 아직은 필요없음.
      state.isFetching.redbooks = 'READY'
      return merge({}, state);

    case 'UPDATE_NOTE_STATE':

    if( action.data.places ){
      state.places = action.data.places;
    }

    return merge({}, state, action.data);

    
    // 노트수정
    case 'UPDATE_NOTE_REQUEST': 
      state.stateNoteUpdate = 'REQUESTING';
      return merge({}, state);
    case 'UPDATE_NOTE_SUCCESS': 
      state.stateNoteUpdate = 'SUCCESS';
      return merge({}, state);
    case 'RESET_UPDATE_NOTE':
      state.isEditing = false;
      state.editingId = null;
      state.formText  = '';
      state.places    = [];

      state.stateNoteUpdate = 'READY';
      return merge({}, state);
    
    // 체크인
    case 'CHECKIN_SUCCESS':
      state.stateCheckIn = 'READY';
      return merge({}, state);
    case 'CHECKIN_FAILURE':
      state.stateCheckIn = 'FAIL';
      return merge({}, state);
    case 'CHECKIN_REQUEST':
      state.stateCheckIn = 'REQUESTING';
      return merge({}, state);

    // 체크 아웃
    case 'CHECKOUT_SUCCESS':
      state.stateCheckOut = 'READY';
      return merge({}, state);
    case 'CHECKOUT_FAILURE':
      state.stateCheckOut = 'FAIL';
      return merge({}, state);
    case 'CHECKOUT_REQUEST':
      state.stateCheckOut = 'REQUESTING';
      return merge({}, state);

    // 댓글 쓰기
    case 'ADD_COMMENT_SUCCESS':
      state.stateAddComment = 'READY';
      return merge({}, state);
    case 'ADD_COMMENT_FAILURE':
      state.stateAddComment = 'FAIL';
      return merge({}, state);
    case 'ADD_COMMENT_REQUEST':
      state.stateAddComment = 'REQUESTING';
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

  }
  
  return state
}

const rootReducer = combineReducers({
  entities,
  pagination,
  errorMessage,
  login,
  routing: routerReducer,
  appState,
  redBookState,
  noteState
  
})

export default rootReducer