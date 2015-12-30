import * as ActionTypes from '../actions'
import merge from 'lodash/object/merge'
import paginate from './paginate'
import { routeReducer, UPDATE_PATH} from 'redux-simple-router'
import { combineReducers } from 'redux'

// Updates an entity cache in response to any action with response.entities.
/**
 * 서버에서 가져온 데이터를 캐시한다
 */
function entities(state = { countries: {}, redBooks: {}, notes:{} }, action) {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities)
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
  
  countries: paginate({
    mapActionToKey: action => null,
    types: [
      ActionTypes.COUNTRIES_REQUEST,
      ActionTypes.COUNTRIES_SUCCESS,
      ActionTypes.COUNTRIES_FAILURE
    ]
  }),
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
  return state
}

function searchKeyword(state = '', action) {
  // if (action.response && action.response.entities) {
  //   return merge({}, state, action.response.entities)
  // }
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
  searchKeyword,
  routing: routeReducer
})

export default rootReducer