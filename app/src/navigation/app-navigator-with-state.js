import { connect } from 'react-redux';
import { createReduxContainer } from 'react-navigation-redux-helpers';


import AppNavigator from './app-navigator';

const App = createReduxContainer(AppNavigator);
const mapStateToProps = (state) => ({
  state: state.nav,
});

export default connect(mapStateToProps)(App);