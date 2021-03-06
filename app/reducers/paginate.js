import merge from 'lodash/merge'
import union from 'lodash/union'
import * as ActionTypes from '../actions';

// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.
export default function paginate({ types, mapActionToKey }) {

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected types to be an array of three elements.')
  }
  if (!types.every(t => typeof t === 'string')) {
    throw new Error('Expected types to be strings.')
  }
  if (typeof mapActionToKey !== 'function') {
    throw new Error('Expected mapActionToKey to be a function.')
  }

  const [ requestType, successType, failureType ] = types

  function updatePagination(state = {
    isFetching: false,
    nextPageUrl: undefined,
    pageCount: 0,
    ids: []
  }, action) {
    switch (action.type) {
      case requestType:
        return merge({}, state, {
          isFetching: true          // 이거 패칭하는거 제거해야한다....
        })
      case successType:

        if( successType === 'CITY_PEOPLES_SUCCESS'){

          return merge({}, {
            isFetching: false,
            ids: action.response.result
          })
        }

        return merge({}, state, {
          isFetching: false,
          ids: union(state.ids, action.response.result),
          nextPageUrl: action.response.nextPageUrl,
          pageCount: state.pageCount + 1
        })
      case failureType:
        return merge({}, state, {
          isFetching: false
        })

      default:
        return state
    }
  }

  return function updatePaginationByKey(state = {}, action) {

    // 노트를 추가했을때 결과값을 페이지네이션에 직접 추가한다.
    if ( action.type === ActionTypes.ADD_NOTE_SUCCESS && state[action.redBookId] ){        
 
      state[action.redBookId].ids.unshift(action.response.result);

      return merge({}, state); 
    }

    // 노트가 삭제되면 해당 아이디를 제거한다.  
    if ( action.type === ActionTypes.DELETE_NOTE_SUCCESS && state[action.response.redBookId]) {

      let notes = state[action.response.redBookId].ids;

      for (let i=0; i < notes.length; ++i){
      
        if( notes[i] === action.response.noteId ){
          notes.splice(i, 1);
          break;
        }
      }

      return merge({}, state); 
    }

    // 체크인하면 아이디를 기록하고,
    if( action.type === 'CHECKIN_SUCCESS' && state[action.uname]){
      state[action.uname].ids.unshift(action.userId);
      return merge({}, state); 
    }

    // 체크아웃하면 아이디를 빼준다.
    if( action.type === 'CHECKOUT_SUCCESS' && state[action.uname]){

      let peoples = state[action.uname].ids;

      for (let i=0; i < peoples.length; ++i){
      
        if( peoples[i] === action.userId ){
          peoples.splice(i, 1);
          break;
        }
      }

      return merge({}, state); 
    }



    // 레드북이 추가되면 페이지 네이션에 아이디를 넣는다.  
    if ( action.type === ActionTypes.ADD_REDBOOK_SUCCESS && state.ids) {

      state.ids.push(action.response.result)
      return merge({}, state); 
    }

        
    switch (action.type) {
      case requestType:
      case successType:
      case failureType:

        const key = mapActionToKey(action)

        if (typeof key !== 'string' && typeof key === null) {
          throw new Error('Expected key to be a string.')
        }

        if( !key ){
          return merge({}, state, updatePagination(state[key], action))
        }

        return merge({}, state, {
          [key]: updatePagination(state[key], action)
        })
      default:
        return state
    }
  }
}