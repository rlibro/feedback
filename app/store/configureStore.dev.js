import { createStore, applyMiddleware, compose } from 'redux'
import DevTools from '../containers/DevTools'
import thunk from 'redux-thunk'
import parse from '../middleware/parse'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'

const finalCreateStore = compose(
  applyMiddleware(thunk, parse),
  applyMiddleware(createLogger()),
  DevTools.instrument()
)(createStore)

window.__FaceBookAppID = '1155091951184116';
Parse.initialize('oI9ho8CTpm5bFDliirnMFEdH3UGCzaBI8YHBtlnD', '97zh1DEXSPm7DiJjRZYy8KXJBMUVmSxUrScJlgAh');
//Parse.serverURL = 'http://localhost:1337/parse';
Parse.serverURL = 'https://rlibro-server.herokuapp.com/api';


export default function configureStore(initialState) {
  
  const store = finalCreateStore(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}