import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer, PersistConfig } from 'redux-persist'
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'
import FilesystemStorage from 'redux-persist-filesystem-storage'
import reducer from './store/reducers'
import { StoreState } from './store/types'
import { Dimensions } from 'react-native'

// const store = createStore(reducer, {
//   recent: {recentList: [], refreshing: false},
//   deviceInfo: {screenMode: false, screenSize: {}}
// })

const persistConfig: PersistConfig = {
  key: 'root',
  storage: FilesystemStorage,
  blacklist: ['nav', 'search', 'anime']
}

const defaultStore: StoreState = {
  recent: { list: [], last: {id: null} }, // valores por defecto para el Reducer recent
  app: { // valores por defecto para el Reducer general
    config: { api: { host: 'kuronosu.dev', route: '/api/v1' } },
    device: {screenMode: true, screenSize: Dimensions.get('window')}
  },
  directory: { updated: false, data: [], updating: false },
}

const persistedReducer = persistReducer(persistConfig, reducer)

const navigationMiddleware = createReactNavigationReduxMiddleware(
  (state: StoreState) => state.nav,
)

const store = createStore(
  persistedReducer,
  defaultStore,
  applyMiddleware(navigationMiddleware)
)


const persistor = persistStore(store)

export { store, persistor }