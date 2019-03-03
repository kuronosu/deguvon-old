import { combineReducers } from 'redux'

import recent from './recent'
import navigation from './navigation'
import app from './app'

const reducer = combineReducers({
  recent,
  app,
  navigation
})

export default reducer