import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import reducer from './reducers/recent';
import storage from 'redux-persist/lib/storage';

// const store = createStore(reducer, {
//   recent: {recentList: [], refreshing: false},
//   deviceInfo: {screenMode: false, screenSize: {}}
// })

const persistConfig = {
  key: 'root',
  storage,
}

const defaultStore = {
  recent: {recentList: [], refreshing: false},
  device: {screenMode: true, screenSize: {}},
  config: {api: {host: 'deguvon.kuronosu.space', route: '/api/v1'}}
}

const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer, defaultStore)
const persistor = persistStore(store)

export { store, persistor }