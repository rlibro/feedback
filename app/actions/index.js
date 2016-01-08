import { CALL_API, Schemas } from '../middleware/api'

export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'

// Fetches a single user from Github API.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchUser(login) {
  return {
    [CALL_API]: {
      types: [ USER_REQUEST, USER_SUCCESS, USER_FAILURE ],
      endpoint: `users/${login}`,
      schema: Schemas.USER
    }
  }
}

// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export function loadUser(login, requiredFields = []) {
  return (dispatch, getState) => {
    const user = getState().entities.users[login]
    if (user && requiredFields.every(key => user.hasOwnProperty(key))) {
      return null
    }

    return dispatch(fetchUser(login))
  }
}


// 레드북이 등록된 나라 목록을 불러온다. 
export const COUNTRIES_REQUEST = 'COUNTRIES_REQUEST'
export const COUNTRIES_SUCCESS = 'COUNTRIES_SUCCESS'
export const COUNTRIES_FAILURE = 'COUNTRIES_FAILURE'

function fetchAllCountries(nextPageUrl) {
  return {
    [CALL_API]: {
      types: [ COUNTRIES_REQUEST, COUNTRIES_SUCCESS, COUNTRIES_FAILURE ],
      endpoint: nextPageUrl,
      schema: Schemas.COUNTRY_ARRAY
    }
  }
}

// 레드북이 등록된 모든 나라를 가져온다.
export function loadAllCounties() {
  return (dispatch, getState) => {

    const {
      nextPageUrl = `/countries`,
      pageCount = 0
    } = getState().pagination.countries || {}

    if (pageCount > 0 && !nextPage) {
      return null
    }

    return dispatch(fetchAllCountries(nextPageUrl))
  }
}

export function loadCounty(name) {
  return (dispatch, getState) => {

    const {
      nextPageUrl = `/countries`,
      pageCount = 0
    } = getState().pagination.countries || {}

    if (pageCount > 0 && !nextPage) {
      return null
    }

    return dispatch(fetchCountry(name, nextPageUrl))
  }
}



// 모든 레드북을 불러온다. 
export const REDBOOKS_REQUEST = 'REDBOOKS_REQUEST'
export const REDBOOKS_SUCCESS = 'REDBOOKS_SUCCESS'
export const REDBOOKS_FAILURE = 'REDBOOKS_FAILURE'

function fetchAllRedBooks(nextPageUrl) {
  return {
    [CALL_API]: {
      types: [ REDBOOKS_REQUEST, REDBOOKS_SUCCESS, REDBOOKS_FAILURE ],
      endpoint: nextPageUrl,
      schema: Schemas.REDBOOK_ARRAY
    }
  }
}

// 레드북이 등록된 모든 나라를 가져온다.
export function loadAllRedBooks() {
  return (dispatch, getState) => {

    const {
      nextPageUrl = `/redbooks`,
      pageCount = 0
    } = getState().pagination.redBooks || {}

    if (pageCount > 0 && !nextPage) {
      return null
    }

    return dispatch(fetchAllRedBooks(nextPageUrl))
  }
}

// 노트를 불러온다. 
export const NOTES_REQUEST = 'NOTES_REQUEST'
export const NOTES_SUCCESS = 'NOTES_SUCCESS'
export const NOTES_FAILURE = 'NOTES_FAILURE'

function fetchNotesOfRedBook(redBookId, nextPageUrl) {
  return {
    redBookId,
    [CALL_API]: {
      types: [ NOTES_REQUEST, NOTES_SUCCESS, NOTES_FAILURE ],
      endpoint: nextPageUrl,
      schema: Schemas.NOTE_ARRAY
    }
  }
}

// 레드북이 등록된 최근 노트 20개를 가져온다. 
export function loadNotesByRedBookId (redBookId) {

  return (dispatch, getState) => {

    const {
      nextPageUrl = `/notes?uname=${redBookId}`,
      pageCount = 0
    } = getState().pagination.notes || {}

    if (pageCount > 0 && !nextPage) {
      return null
    }

    return dispatch(fetchNotesOfRedBook(redBookId, nextPageUrl))
  }
}


// 노트에 커맨트를 추가한다. 
export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST'
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS'
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE'

function addNoteComment(noteId, commentText){

  return {
    [CALL_API]: {
      method: 'POST',
      data: { noteId, commentText},
      types: [ ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE ],
      endpoint: '/notes/comment',
      schema: Schemas.COMMENT
    }
  }

}

export function submitNoteComment (noteId, commentText) {
  return (dispatch, getState) => {
    return dispatch(addNoteComment(noteId, commentText));
  }
}

/**
 * 레드북에 노트를 추가한다. 
 * START OF submitRedBookNote
 */
export const ADD_NOTE_REQUEST = 'ADD_NOTE_REQUEST'
export const ADD_NOTE_SUCCESS = 'ADD_NOTE_SUCCESS'
export const ADD_NOTE_FAILURE = 'ADD_NOTE_FAILURE'

function addRedBookNote(redBookId, redBookUname, noteText){

  return {
    redBookUname,
    [CALL_API]: {
      method: 'POST',
      data: { redBookId, noteText },
      types: [ ADD_NOTE_REQUEST, ADD_NOTE_SUCCESS, ADD_NOTE_FAILURE ],
      endpoint: '/notes',
      schema: Schemas.NOTE
    }
  }

}

export function submitRedBookNote (redBookId, noteText, redBookUname){

  return (dispatch, getState) => {
    return dispatch(addRedBookNote(redBookId, redBookUname, noteText));
  } 
}
/* END OF submitRedBookNote */


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
 export function setNewRedBookCityName(cityData){
  return (dispatch, getState) => {
    return dispatch({
      type: 'SET_NEW_RED_BOOK_CITY_NAME',
      cityName: cityData[0].label
    });
  }
 }
/* END OF setNewRedBookCityName */

