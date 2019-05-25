import { combineReducers } from 'redux'

import { StoreState } from '../types'
import recent from './recent'
import nav from './navigation'
import app from './app'
import directory from './directory'
import search from './search'
import anime from './anime'

const reducer = combineReducers<StoreState>({
  nav,
  app,
  recent,
  directory,
  search,
  anime,
})

export default reducer