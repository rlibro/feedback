import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import parse from '../middleware/parse'
import rootReducer from '../reducers'

const finalCreateStore = compose(
  applyMiddleware(thunk, parse)
)(createStore)

window.__FaceBookAppID = '1155089597851018';
Parse.initialize('oI9ho8CTpm5bFDliirnMFEdH3UGCzaBI8YHBtlnD', '97zh1DEXSPm7DiJjRZYy8KXJBMUVmSxUrScJlgAh');

export default function configureStore(initialState) {
  return finalCreateStore(rootReducer, initialState)
}