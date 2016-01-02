import merge from 'lodash/object/merge'
import union from 'lodash/array/union'
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
          isFetching: true
        })
      case successType:
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
    if ( action.type === ActionTypes.ADD_NOTE_SUCCESS 
      && action.redBookUname && state[action.redBookUname]){
        
      state[action.redBookUname].ids.unshift(action.response.result);

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