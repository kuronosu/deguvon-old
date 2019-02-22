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
  deviceInfo: {screenMode: true, screenSize: {}}
}

const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer, defaultStore)
const persistor = persistStore(store)

export { store, persistor }