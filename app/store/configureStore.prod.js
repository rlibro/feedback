import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import parse from '../middleware/parse'
import rootReducer from '../reducers'

const finalCreateStore = compose(
  applyMiddleware(thunk, parse)
)(createStore)

export default function configureStore(initialState) {
  return finalCreateStore(rootReducer, initialState)
}