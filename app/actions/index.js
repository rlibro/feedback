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

export const REPO_REQUEST = 'REPO_REQUEST'
export const REPO_SUCCESS = 'REPO_SUCCESS'
export const REPO_FAILURE = 'REPO_FAILURE'

// Fetches a single repository from Github API.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchRepo(fullName) {
  return {
    [CALL_API]: {
      types: [ REPO_REQUEST, REPO_SUCCESS, REPO_FAILURE ],
      endpoint: `repos/${fullName}`,
      schema: Schemas.REPO
    }
  }
}

// Fetches a single repository from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export function loadRepo(fullName, requiredFields = []) {
  return (dispatch, getState) => {
    const repo = getState().entities.repos[fullName]
    if (repo && requiredFields.every(key => repo.hasOwnProperty(key))) {
      return null
    }

    return dispatch(fetchRepo(fullName))
  }
}

export const STARRED_REQUEST = 'STARRED_REQUEST'
export const STARRED_SUCCESS = 'STARRED_SUCCESS'
export const STARRED_FAILURE = 'STARRED_FAILURE'

// Fetches a page of starred repos by a particular user.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchStarred(login, nextPageUrl) {
  return {
    login,
    [CALL_API]: {
      types: [ STARRED_REQUEST, STARRED_SUCCESS, STARRED_FAILURE ],
      endpoint: nextPageUrl,
      schema: Schemas.REPO_ARRAY
    }
  }
}

// Fetches a page of starred repos by a particular user.
// Bails out if page is cached and user didn’t specifically request next page.
// Relies on Redux Thunk middleware.
export function loadStarred(login, nextPage) {
  return (dispatch, getState) => {
    const {
      nextPageUrl = `users/${login}/starred`,
      pageCount = 0
    } = getState().pagination.starredByUser[login] || {}

    if (pageCount > 0 && !nextPage) {
      return null
    }

    return dispatch(fetchStarred(login, nextPageUrl))
  }
}

export const STARGAZERS_REQUEST = 'STARGAZERS_REQUEST'
export const STARGAZERS_SUCCESS = 'STARGAZERS_SUCCESS'
export const STARGAZERS_FAILURE = 'STARGAZERS_FAILURE'

// Fetches a page of stargazers for a particular repo.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchStargazers(fullName, nextPageUrl) {
  return {
    fullName,
    [CALL_API]: {
      types: [ STARGAZERS_REQUEST, STARGAZERS_SUCCESS, STARGAZERS_FAILURE ],
      endpoint: nextPageUrl,
      schema: Schemas.USER_ARRAY
    }
  }
}

// Fetches a page of stargazers for a particular repo.
// Bails out if page is cached and user didn’t specifically request next page.
// Relies on Redux Thunk middleware.
export function loadStargazers(fullName, nextPage) {
  return (dispatch, getState) => {
    const {
      nextPageUrl = `repos/${fullName}/stargazers`,
      pageCount = 0
    } = getState().pagination.stargazersByRepo[fullName] || {}

    if (pageCount > 0 && !nextPage) {
      return null
    }

    return dispatch(fetchStargazers(fullName, nextPageUrl))
  }
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// Resets the currently visible error message.
export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE
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
      nextPageUrl = `/notes?redBookId=${redBookId}`,
      pageCount = 0
    } = getState().pagination.notes || {}

    if (pageCount > 0 && !nextPage) {
      return null
    }

    return dispatch(fetchNotesOfRedBook(redBookId, nextPageUrl))
  }
}



