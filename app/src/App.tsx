import React, { Component, Fragment } from "react"
import { Provider } from 'react-redux'
import Orientation from 'react-native-orientation'
import DropdownAlert from 'react-native-dropdownalert'
import { PersistGate } from "redux-persist/integration/react"
import { Provider as PaperProvider } from 'react-native-paper'

import { store, persistor } from './store'
import Loading from './screens/components/loading'
import DropDownHolder from './utils/dropdownholder'
import AppContainer from "./screens/containers/app-container"
import AppNavigatorWithState from './navigation/app-navigator-with-state'

console.disableYellowBox = true

export default class Deguvon extends Component<{}> {

  constructor(props: {}) {
    super(props)
    Orientation.unlockAllOrientations()
  }

  render() {
    return (
      <Fragment>
        <Provider store={store}>
          <PersistGate loading={<Loading />} persistor={persistor}>
            <PaperProvider>
              <AppContainer>
                <AppNavigatorWithState />
              </AppContainer>
            </PaperProvider>
          </PersistGate>
        </Provider>
        <DropdownAlert ref={(ref: DropdownAlert) => DropDownHolder.setDropDown(ref)} closeInterval={4000} />
      </Fragment>
    )
  }
}