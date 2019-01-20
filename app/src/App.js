// @flow

import React, { Component } from "react";
import { View, Text } from "react-native";
import Layout from "./components/layout/index";
import Settings from "./features/settings/containers";
import Home from "./screens/containers/home";
import Header from "./features/header/components";
import Recent from "./features/recent/containers";
import Navbar from "./navigation/containers/navbar";

export default class MyApp extends Component {
  state = {
    active: 'HOME'
  }
  onPressNavbarButton = active => {
    this.setState({
      active: active
    })
  }
  rederActive(){
    if (this.state.active == 'HOME'){
      return <Recent/>
    } else if (this.state.active == 'SETTINGS'){
      return <Settings/>
    }
    return <Recent/>
  }
  render() {
    return (
      <Layout>
        <Header/>
        {this.rederActive()}
        <Navbar
          onPressButton={this.onPressNavbarButton}
        />
      </Layout>
    );
  }
}
