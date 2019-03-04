import React, { Component } from "react";
import { Dimensions, BackHandler } from "react-native";
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'
import Base from "../components/base";

class AppLayout extends Component {

  _updateScreenInfo(){
    const d = Dimensions.get('window')
    this.props.dispatch({
      type: 'SET_DEVICE_DATA',
      payload: {
        screenMode: d.width < d.height,
        screenSize: d
      }
    })
  }

  _onLayout = e => {
    this._updateScreenInfo()
  }

  _onBackButtonPressAndroid = () => {
    if (this.props.nav.index === 0) {
      return false;
    }

    this.props.dispatch(NavigationActions.back());
    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this._onBackButtonPressAndroid);
  }

  componentWillMount(){
    this._updateScreenInfo()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._onBackButtonPressAndroid);
  }

  render() {
    return (
      <Base onLayout={this._onLayout}>
        {this.props.children}
      </Base>
    )
  }
}

export default connect(null)(AppLayout)