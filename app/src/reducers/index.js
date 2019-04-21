import { combineReducers } from 'redux'

import recent from './recent'
import nav from './navigation'
import app from './app'
import directory from './directory'
import search from './search'

const reducer = combineReducers({
  nav,
  app,
  recent,
  directory,
  search
})

export default reducer