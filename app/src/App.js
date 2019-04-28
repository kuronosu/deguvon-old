import React, { Component, Fragment } from "react"
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react"
import DropdownAlert from 'react-native-dropdownalert'
import Orientation from 'react-native-orientation'

import Loading from './screens/components/loading'
import { store, persistor } from './store'
import AppNavigatorWithState from './navigation/app-navigator-with-state'
import DropDownHolder from './utils/dropdownholder'
import AppContainer from "./screens/containers/app-container"

console.disableYellowBox = true

export default class Deguvon extends Component {

  constructor(props) {
    super(props)
    Orientation.unlockAllOrientations()
  }

  render() {
    return (
      <Fragment>
        <Provider
          store={store}
        >
          <PersistGate loading={<Loading />} persistor={persistor}>
            <AppContainer>
              <AppNavigatorWithState />
            </AppContainer>
          </PersistGate>
        </Provider>
        <DropdownAlert ref={ref => DropDownHolder.setDropDown(ref)} closeInterval={4000} />
      </Fragment>
    )
  }
}
