import React, { Component } from "react";
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";

import Loading from './screens/components/loading'
import { store, persistor } from './store';
import AppLayout from "./app-layout";
import AppNavigator from './navigation/app-navigator'

export default class Deguvon extends Component {
  render() {
    return (
      <Provider
        store={store}
      >
        <PersistGate loading={<Loading/>} persistor={persistor}>
          {/* <AppLayout /> */}
          <AppNavigator/>
        </PersistGate>
      </Provider>
    );
  }
}
