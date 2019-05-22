import { createStore, applyMiddleware, Store } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'
import FilesystemStorage from 'redux-persist-filesystem-storage'
import reducer from './store/reducers'
import { ApplicationState } from './store/types'

// const store = createStore(reducer, {
//   recent: {recentList: [], refreshing: false},
//   deviceInfo: {screenMode: false, screenSize: {}}
// })

const persistConfig = {
  key: 'root',
  storage: FilesystemStorage,
  blacklist: ['nav', 'search', 'anime']
}

const defaultStore: ApplicationState = {
  recent: { recentList: [], last: { id: undefined } }, // valores por defecto para el Reducer recent
  app: { // valores por defecto para el Reducer general
    device: { screenMode: true, screenSize: {} },
    config: { api: { host: 'kuronosu.dev', route: '/api/v1' } }
  },
  directory: { updated: false, data: [], updating: false },
  search: { text: '' },
  anime: { aid: '', url: '', slug: '', name: '', image: '', typea: '', synopsis: '', genres: [], listAnmRel: [], episodeList: [] },
  nav: { index: -1, routes: [], isTransitioning: false, key: '', params: {}, }
}

const persistedReducer = persistReducer(persistConfig, reducer)

const navigationMiddleware = createReactNavigationReduxMiddleware(
  (state: ApplicationState) => state.nav,
)

const store = createStore(
  persistedReducer,
  defaultStore,
  applyMiddleware(navigationMiddleware)
)


const persistor = persistStore(store)


export { store, persistor }

// export default function configureStore(history: History, initialState: ApplicationState): Store<ApplicationState> {
//   // create the composing function for our middlewares
//   const composeEnhancers = composeWithDevTools({});

//   // We'll create our store with the combined reducers and the initial Redux state that
//   // we'll be passing from our entry point.
//   return createStore<ApplicationState>(
//     reducers,
//     initialState,
//     composeEnhancers(applyMiddleware(
//       routerMiddleware(history),
//     )),
//   );
// }