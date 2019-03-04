import { combineReducers } from 'redux'

import recent from './recent'
import nav from './navigation'
import app from './app'
import anime from './anime'

const reducer = combineReducers({
  nav,
  app,
  recent,
  anime
})

export default reducer