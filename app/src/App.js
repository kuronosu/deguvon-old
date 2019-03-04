import React, { Component } from "react";
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";

import Loading from './screens/components/loading'
import { store, persistor } from './store';
import AppNavigatorWithState from './navigation/app-navigator-with-state'

export default class Deguvon extends Component {
  render() {
    return (
      <Provider
        store={store}
      >
        <PersistGate loading={<Loading/>} persistor={persistor}>
          <AppNavigatorWithState/>
        </PersistGate>
      </Provider>
    );
  }
}
