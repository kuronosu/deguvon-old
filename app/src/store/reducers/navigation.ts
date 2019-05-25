import { createNavigationReducer } from 'react-navigation-redux-helpers'

import AppNavigator from '../../navigation/app-navigator'

const navigatorReducer = createNavigationReducer(AppNavigator)
export default navigatorReducer