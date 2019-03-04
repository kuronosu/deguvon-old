import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { createReactNavigationReduxMiddleware, createReduxContainer } from 'react-navigation-redux-helpers';
import storage from 'redux-persist/lib/storage';
import reducer from './reducers';

// const store = createStore(reducer, {
//   recent: {recentList: [], refreshing: false},
//   deviceInfo: {screenMode: false, screenSize: {}}
// })

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['nav', 'anime']
}

const defaultStore = {
  recent: {recentList: [], refreshing: false}, // valores por defecto para el Reducer recent
  app: { // valores por defecto para el Reducer general
    device: {screenMode: true, screenSize: {}},
    config: {api: {host: 'deguvon.kuronosu.space', route: '/api/v1'}}
  },
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