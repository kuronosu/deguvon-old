import { connect } from 'react-redux'
import { createReduxContainer } from 'react-navigation-redux-helpers'


import AppNavigator from './app-navigator'
import { StoreState } from '../'

const App = createReduxContainer(AppNavigator)
const mapStateToProps = (state: StoreState) => ({
  state: state.nav,
})

export default connect(mapStateToProps)(App)