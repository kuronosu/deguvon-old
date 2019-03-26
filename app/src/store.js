import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import storage from 'redux-persist/lib/storage';
import FilesystemStorage from 'redux-persist-filesystem-storage'
import reducer from './reducers';

// const store = createStore(reducer, {
//   recent: {recentList: [], refreshing: false},
//   deviceInfo: {screenMode: false, screenSize: {}}
// })

const persistConfig = {
  key: 'root',
  storage: FilesystemStorage,
  blacklist: ['nav', 'anime', 'search']
}

const defaultStore = {
  recent: {recentList: [], last: {id: null}}, // valores por defecto para el Reducer recent
  app: { // valores por defecto para el Reducer general
    device: {screenMode: true, screenSize: {}},
    config: {api: {host: 'kuronosu.dev', route: '/api/v1'}}
  },
  directory: {updated: false, data: [], updating: false},
  search: {text: ''},
}

const persistedReducer = persistReducer(persistConfig, reducer)

const navigationMiddleware = createReactNavigationReduxMiddleware(
  state => state.nav,
);

const store = createStore(
  persistedReducer,
  defaultStore,
  applyMiddleware(navigationMiddleware)
)


const persistor = persistStore(store)


export { store, persistor }