import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistCombineReducers } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';

import reducers from './Reducer'
import logger from 'redux-logger'
// import { DESTROY_SESSION } from './reducers/auth/auth.constant'

// redux persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth']
}


const persistedReducer = persistCombineReducers(persistConfig, reducers)
// compose enchancer here and middleware
const composedEnhancers = compose(
  applyMiddleware(...[thunk, logger]),
);

export default () => {
  let store = createStore(persistedReducer, {}, composedEnhancers)
  let persistor = persistStore(store)
  return { store, persistor }
}
