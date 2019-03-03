import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'
import reducer from './reducers';
import storage from 'redux-persist/lib/storage';

// const store = createStore(reducer, {
//   recent: {recentList: [], refreshing: false},
//   deviceInfo: {screenMode: false, screenSize: {}}
// })

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['navigation']
}

const defaultStore = {
  recent: {recentList: [], refreshing: false}, // valores por defecto para el Reducer recent
  app: { // valores por defecto para el Reducer general
    device: {screenMode: true, screenSize: {}},
    config: {api: {host: 'deguvon.kuronosu.space', route: '/api/v1'}}
  }
}

const persistedReducer = persistReducer(persistConfig, reducer)

const navigationMiddleware = createReactNavigationReduxMiddleware(
  'navigation',
  state => state.navigation
)

const store = createStore(
  persistedReducer,
  defaultStore,
  // applyMiddleware(navigationMiddleware)
)
const persistor = persistStore(store)

export { store, persistor }