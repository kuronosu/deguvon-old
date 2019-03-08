import { combineReducers } from 'redux'

import recent from './recent'
import nav from './navigation'
import app from './app'
import anime from './anime'
import directory from './directory'

const reducer = combineReducers({
  nav,
  app,
  recent,
  anime,
  directory,
})

export default reducer