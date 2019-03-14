import React, { Component, Fragment } from "react";
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import DropdownAlert from 'react-native-dropdownalert';

import Loading from './screens/components/loading'
import { store, persistor } from './store';
import AppNavigatorWithState from './navigation/app-navigator-with-state'
import DropDownHolder from './utils/dropdownholder'

console.disableYellowBox = true;

export default class Deguvon extends Component {
  render() {
    return (
      <Fragment>
        <Provider
          store={store}
        >
          <PersistGate loading={<Loading/>} persistor={persistor}>
            <AppNavigatorWithState/>
          </PersistGate>
        </Provider>
        <DropdownAlert ref={ref => DropDownHolder.setDropDown(ref)} closeInterval={4000}/>
      </Fragment>
    );
  }
}
